from uuid import UUID
from typing import Optional, Annotated

import sqlalchemy.exc
from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.api.routes.auth.fastapi_users_auth_router import (
    current_active_user,
    current_active_super_user,
)
from src.api.schemes import (
    Response400Schema,
    Response404Schema,
    Response500Schema,
    PaginationParams,
    OrderParams,
)
from src.api.routes.education.user_course_progress.schemes import (
    UserCourseProgressCreateBatchSchema,
    UserCourseProgressReadSchema,
    UserCourseProgressDeleteBatchSchema,
)
from src.models.dbo.database_models import User
from src.services.user_course_progresses.user_course_progress import (
    UserCourseProgressService,
    get_user_course_progress_service,
)
from src.utils.helpers import pagination_params

progress_router = APIRouter(
    prefix="/education/progress",
    tags=["UserCourseProgress"],
)


@progress_router.get(
    "",
    responses={
        200: {
            "model": UserCourseProgressReadSchema,
            "description": "Progress retrieved successfully",
        },
        404: {
            "model": Response404Schema,
            "description": "Progress not found",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve user course progress",
)
async def get_user_progress(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    user_id: Optional[UUID] = Query(None, description="User ID to filter progress"),
    course_id: Optional[UUID] = Query(None, description="Course ID to filter progress"),
    pagination: PaginationParams = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: UserCourseProgressService = Depends(get_user_course_progress_service),
):
    """
    Get list of user course progress records.
    You can filter by `user_id` or `course_id`.
    """
    try:
        result = await service.get_user_progress(
            user_id=user_id,
            course_id=course_id,
            pagination=pagination,
            order_by=order_by.model_dump()["order_by"],
        )
        if not result:
            raise HTTPException(status_code=404, detail="Progress not found")
        return result
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"detail": "Internal server error", "code": "server_error"},
        )


@progress_router.post(
    "",
    responses={
        201: {
            "model": UserCourseProgressCreateBatchSchema,
            "description": "Progress records created or updated successfully",
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
    summary="Create or update user course progress records",
)
async def create_or_update_user_progress(
    user: Annotated[
        User,
        Depends(current_active_super_user),
    ],
    data: UserCourseProgressCreateBatchSchema,
    service: UserCourseProgressService = Depends(get_user_course_progress_service),
):
    try:
        return await service.create_or_update_progress(data.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user or course reference.",
        )


@progress_router.delete(
    "",
    responses={
        200: {
            "model": UserCourseProgressDeleteBatchSchema,
            "description": "Progress records deleted successfully",
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
    summary="Delete user course progress records by ID",
)
async def delete_user_progress(
    user: Annotated[
        User,
        Depends(current_active_super_user),
    ],
    data: UserCourseProgressDeleteBatchSchema,
    service: UserCourseProgressService = Depends(get_user_course_progress_service),
):
    try:
        return await service.delete_progress(data.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found or conflict.",
        )
