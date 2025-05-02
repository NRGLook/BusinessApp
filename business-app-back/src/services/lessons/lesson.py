from uuid import UUID
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import Depends

import src.models.managers as managers
from src.api.schemes import PaginationParams
from src.api.routes.education.lesson.schemes import (
    LessonRead,
    LessonListResponseSchema,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class LessonService(BaseService):
    def __init__(self, db: AsyncSession):
        self.lesson_manager = managers.LessonManager(db)

    async def get_lesson_by_id(
        self,
        lesson_id: UUID,
        search: Optional[str],
        order_by: list[str],
        pagination: PaginationParams,
        **filters,
    ):
        filters["name__ilike"] = search
        lessons: list = await self.lesson_manager.search(
            order_by=order_by,
            pagination=pagination,
            lesson_id=lesson_id,
            **filters,
        )
        total = await self.lesson_manager.count(
            lesson_id=lesson_id,
            **filters,
        )

        lessons_mapped = [self.map_obj_to_schema(lesson, LessonRead).model_dump() for lesson in lessons]

        return LessonListResponseSchema.create(list_data=lessons_mapped, pagination=pagination, total=total)


async def get_lesson_service(
    db: AsyncSession = Depends(get_session),
) -> LessonService:
    """
    Dependency injection function that provides an instance of LessonService with a database session.
    """
    return LessonService(db=db)
