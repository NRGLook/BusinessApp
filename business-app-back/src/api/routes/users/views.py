from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status

from src.api.routes.users.schemes import UserProfileResponse
from src.api.schemes import (
    Response400Schema,
    Response500Schema,
)
from src.services.users.user import (
    UserService,
    get_user_service,
)

user_router = APIRouter(
    prefix="/user",
    tags=["User"],
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
