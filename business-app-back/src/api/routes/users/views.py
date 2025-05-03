from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    Query,
    HTTPException,
    status,
)
from fastapi.security import HTTPBearer

from src.api.routes.auth.fastapi_users_auth_router import fastapi_users
from src.api.routes.users.schemes import (
    UserProfileResponse,
    UserRead,
    UserUpdate,
)
from src.api.schemes import (
    Response400Schema,
    Response500Schema,
)
from src.services.users.user import (
    UserService,
    get_user_service,
)

http_bearer = HTTPBearer(auto_error=False)

user_router = APIRouter(
    prefix="/user",
    tags=["User"],
    dependencies=[Depends(http_bearer)],
)

user_router.include_router(
    router=fastapi_users.get_users_router(
        UserRead,
        UserUpdate,
    )
)


@user_router.get(
    "/profile",
    responses={
        200: {
            "model": UserProfileResponse,
            "description": "User found successfully",
        },
        400: {
            "model": Response400Schema,
            "description": "Invalid request",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve businesses with search, sorting, and pagination",
)
async def get_user_profile(
    # request: Request,
    search: Optional[str] = Query(None, description="Search by user name"),
    service: UserService = Depends(get_user_service),
):
    try:
        return await service.get_users(
            search=search,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
