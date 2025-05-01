import logging
import traceback
import sys

from src.api.schemes import (
    DebugResponse500Schema,
    Response400Schema,
    Response401Schema,
    Response403Schema,
    Response404Schema,
    Response422Schema,
    Response429Schema,
    Response500Schema,
)

from fastapi import (
    Request,
    status,
    FastAPI,
    HTTPException,
)
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from slowapi.errors import RateLimitExceeded

from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import Response


def init_exc_handlers(app: FastAPI):
    """
    Initialize exception handlers for the FastAPI application.

    Parameters:
    app (FastAPI): The FastAPI application instance.

    Returns:
    None

    This function sets up exception handlers for
    HTTPException, RequestValidationError,
    and 500 Internal Server Error if the debug mode is enabled.
    """
    app.exception_handler(HTTPException)(sc_response_exception_handler)
    app.exception_handler(RequestValidationError)(validation_exception_handler)


async def internal_exception_handler(request: Request, exc: Exception):
    """
    This function is an exception handler for internal server errors.
    It catches any exception that occurs during the request processing,
    formats the traceback, and returns a JSON response with the traceback
    details.

    Parameters:
    - request: The FastAPI Request object.
    - exc: The Exception object that was raised.

    Returns:
    - A JSONResponse object with the traceback details.
    """
    try:
        raise exc
    except Exception:
        tb_lines = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__)).split("\n")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=jsonable_encoder(
            DebugResponse500Schema(success=False, message="Internal Server Error", trace=tb_lines)
        ),
    )


async def general_exception_handler(request: Request, exc: Exception):
    """
    This function is an exception handler for general server errors.
    It catches any exception that occurs during the request processing,
    and returns a JSON response with a generic error message.

    Parameters:
        request: The FastAPI Request object. This object contains
        information about the incoming request.
        exc: The Exception object that was raised. This object
            contains information about the error that occurred.

    Returns:
    A JSONResponse object with the following content:
        'success': A boolean value indicating the success status of the request
            In this case, it is False.
        'message': A string message indicating the error. In this case,
            it is 'Internal Server Error'.
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=jsonable_encoder(Response500Schema(success=False, message="Internal Server Error")),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Exception handler for RequestValidationError exceptions.
    This function processes the validation errors from FastAPI's
    RequestValidationError,
    formats the error messages, and returns a JSON response with the error
    details.

    Parameters:
    - request: The FastAPI Request object.
    - exc: The RequestValidationError exception object that was raised.

    Returns:
    - A JSONResponse object with the formatted error details.
    """
    errors_data = exc.errors()
    response_result = {}
    main_message = "Error in the request"
    for error in errors_data:
        message = error.get("msg")
        if len(error["loc"]) == 2:
            response_error = {"field": error["loc"][1], "message": message}
            response_result[error["loc"][1]] = response_error
        else:
            messages = message.split(", ")
            if len(messages) == 2:
                message = messages[1]
            main_message = message
            break
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({"code": 422, "detail": response_result, "main_message": main_message}),
    )


async def sc_response_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Exception handler for StarletteHTTPException exceptions.
    This function processes exceptions raised by StarletteHTTPException,
    which are typically raised when a request encounters an error status code.
    It retrieves the appropriate schema for the error status code from
    a dictionary, creates a JSON response using the schema, and returns
    the response.

    Parameters:
        request: The FastAPI Request object. This object contains
            information about the incoming request.
        exc: The StarletteHTTPException exception object that was raised.
        This object contains information about the error that occurred.

    Returns:
    A JSONResponse object with the following content:
        'status_code': The status code of the error response.
        'content': The content of the error response,
        formatted using the appropriate schema.
    """
    schemas_status_code_dict = {
        status.HTTP_400_BAD_REQUEST: Response400Schema,
        status.HTTP_401_UNAUTHORIZED: Response401Schema,
        status.HTTP_403_FORBIDDEN: Response403Schema,
        status.HTTP_404_NOT_FOUND: Response404Schema,
        status.HTTP_422_UNPROCESSABLE_ENTITY: Response422Schema,
        status.HTTP_500_INTERNAL_SERVER_ERROR: Response500Schema,
    }

    status_code = exc.status_code
    schema = schemas_status_code_dict.get(status_code, Response500Schema)

    return JSONResponse(status_code=status_code, content=schema(message=str(exc.detail)).model_dump())


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """
    Build a simple JSON response that includes the details of the rate limit
    that was hit. If no limit is hit, the countdown is added to headers.
    """
    response = JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content=jsonable_encoder(Response429Schema(success=False, message=f"Rate limit exceeded: {exc.detail}")),
    )
    response = request.app.state.limiter._inject_headers(response, request.state.view_rate_limit)
    return response


class StdHandler(logging.StreamHandler):
    def flush(self):
        sys.stdout.flush()
