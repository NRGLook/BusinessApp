from uuid import UUID
from typing import Optional

import sqlalchemy.exc
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import Depends, HTTPException

import src.models.managers as managers
from src.api.schemes import PaginationParams
from src.api.routes.education.lesson.schemes import (
    LessonReadSchema,
    LessonListResponseSchema,
    LessonCreateSchema,
    LessonDeleteSchema,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class LessonService(BaseService):
    def __init__(self, db: AsyncSession):
        self.lesson_manager = managers.LessonManager(db)

    async def get_lessons(
        self,
        lesson_id: Optional[UUID],
        search: Optional[str],
        order_by: list[str],
        pagination: PaginationParams,
        **filters,
    ):
        filters["name__ilike"] = search
        lessons: list = await self.lesson_manager.search(
            order_by=order_by,
            pagination=pagination,
            id=lesson_id,
            **filters,
        )
        total = await self.lesson_manager.count(
            id=lesson_id,
            **filters,
        )

        lessons_mapped = [self.map_obj_to_schema(lesson, LessonReadSchema).model_dump() for lesson in lessons]

        return LessonListResponseSchema.create(list_data=lessons_mapped, pagination=pagination, total=total)

    async def create_or_update_lessons(
        self,
        lessons: list[LessonCreateSchema],
    ) -> list:
        """
        Create, update lesson based on the provided data.
        """
        lesson_create_update = []

        for lesson in lessons:
            lesson_create_update.append(
                LessonCreateSchema(
                    **lesson.model_dump(),
                )
            )

        try:
            updated_lesson = await self.lesson_manager.create_or_update(lesson_create_update)
        except sqlalchemy.exc.IntegrityError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e),
            )

        return updated_lesson

    async def delete_lessons(
        self,
        lessons: list[LessonDeleteSchema],
    ) -> None:
        """
        Delete lessons based on the provided list of IDs.
        """
        try:
            for lesson in lessons:
                if lesson.id is not None:
                    await self.lesson_manager.delete_by_id(lesson.id)
        except sqlalchemy.exc.IntegrityError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e),
            )


async def get_lesson_service(
    db: AsyncSession = Depends(get_session),
) -> LessonService:
    """
    Dependency injection function that provides an instance of LessonService with a database session.
    """
    return LessonService(db=db)
