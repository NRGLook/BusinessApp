from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from src.api.schemes import Response500Schema, PaginationParams, OrderParams
from src.api.routes.education.lesson.schemes import LessonRead

from src.services.lessons.lesson import LessonService, get_lesson_service
from src.utils.helpers import pagination_params

lessons_router = APIRouter(
    prefix="/education",
    tags=["Lessons"],
)


@lessons_router.get(
    "/lessons/{lesson_id}",
    responses={
        200: {
            "model": LessonRead,
            "description": "Lesson found successfully",
        },
        404: {
            "description": "Lesson not found",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve lesson by ID",
)
async def get_lesson(
    # credentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())],
    lesson_id: UUID,
    search: Optional[str] = Query(None, description="Search by housing name"),
    pagination: PaginationParams = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: LessonService = Depends(get_lesson_service),
):
    try:
        lesson = await service.get_lesson_by_id(
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
            status_code=500,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )
