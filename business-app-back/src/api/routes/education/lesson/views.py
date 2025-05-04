from uuid import UUID
from typing import Optional, Annotated

import sqlalchemy.exc

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.api.routes.auth.fastapi_users_auth_router import (
    current_active_user,
    current_active_super_user,
)
from src.api.schemes import (
    Response500Schema,
    PaginationParams,
    OrderParams,
    Response400Schema,
    Response404Schema,
)
from src.api.routes.education.lesson.schemes import (
    LessonCreateBatchSchema,
    LessonReadSchema,
    LessonDeleteBatchSchema,
)
from src.models.dbo.database_models import User
from src.services.lessons.lesson import LessonService, get_lesson_service
from src.utils.helpers import pagination_params

lessons_router = APIRouter(
    prefix="/education/lessons",
    tags=["Lessons"],
)


@lessons_router.get(
    "",
    responses={
        200: {
            "model": LessonReadSchema,
            "description": "Lesson found successfully",
        },
        404: {
            "model": Response404Schema,
            "description": "Lesson not found",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve lesson by ID",
)
async def get_lessons(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    lesson_id: Optional[UUID] = Query(None, description="ID of the lesson"),
    search: Optional[str] = Query(None, description="Search by lesson name"),
    pagination: PaginationParams = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: LessonService = Depends(get_lesson_service),
):
    try:
        lesson = await service.get_lessons(
            lesson_id=lesson_id,
            search=search,
            pagination=pagination,
            order_by=order_by.model_dump()["order_by"],
        )
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        return lesson
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@lessons_router.post(
    "",
    responses={
        201: {
            "model": LessonCreateBatchSchema,
            "description": "Lesson created/updated successfully",
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
    summary="Create, update lessons according to your provided data",
)
async def create_or_update_contractor_works(
    user: Annotated[
        User,
        Depends(current_active_super_user),
    ],
    lessons: LessonCreateBatchSchema,
    service: LessonService = Depends(get_lesson_service),
):
    try:
        return await service.create_or_update_lessons(lessons.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found.",
        )


@lessons_router.delete(
    "",
    responses={
        200: {
            "model": LessonDeleteBatchSchema,
            "description": "Lesson deleted successfully",
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
    summary="Delete lesson according to your provided data",
)
async def delete_lessons(
    user: Annotated[
        User,
        Depends(current_active_super_user),
    ],
    lessons: LessonDeleteBatchSchema,
    service: LessonService = Depends(get_lesson_service),
):
    try:
        return await service.delete_lessons(lessons.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found.",
        )
