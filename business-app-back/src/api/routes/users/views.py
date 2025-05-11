from typing import (
    Annotated,
)
from uuid import UUID

import sqlalchemy.exc

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.security import HTTPBearer

from src.api.routes.auth.fastapi_users_auth_router import (
    fastapi_users,
    current_active_user,
)
from src.api.routes.users.schemes import (
    UserProfileResponse,
    UserRead,
    UserUpdate,
    UserEmailOutSchema,
    UserProfileCreateBatchSchema,
)
from src.api.schemes import (
    Response400Schema,
    Response500Schema,
)
from src.models.dbo.database_models import User
from src.services.logger import LoggerProvider
from src.services.users.user import (
    UserService,
    get_user_service,
)

http_bearer = HTTPBearer(auto_error=False)
log = LoggerProvider().get_logger(__name__)

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
    "/{user_id}/profile",
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
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    service: UserService = Depends(get_user_service),
):
    try:
        log.info("Fetching user profile for user ID: %s", user.id)
        profile_info = await service.get_user_profile_info(user_id=user.id)
        log.info("Profile info retrieved successfully: %s", profile_info)
        return profile_info
    except ValueError as e:
        log.error("ValueError occurred: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
    except Exception as e:
        log.error("Unexpected error occurred: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"detail": "Internal server error"},
        )


@user_router.get(
    "/email/{user_id}",
    responses={
        200: {
            "model": UserEmailOutSchema,
            "description": "User email/username found successfully",
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
async def get_user_email(
    user_id: UUID,
    service: UserService = Depends(get_user_service),
):
    try:
        return await service.get_user_email(
            user_id=user_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@user_router.post(
    "/{user_id}/profile/edit",
    responses={
        201: {
            "model": UserProfileCreateBatchSchema,
            "description": "User profile created/updated successfully",
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
    summary="Create, update user profile",
)
async def create_or_update_user_profile(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    users: UserProfileCreateBatchSchema,
    service: UserService = Depends(get_user_service),
):
    try:
        return await service.create_or_update_user_profile(
            users.data,
            user_id=user.id,
        )
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found.",
        )
