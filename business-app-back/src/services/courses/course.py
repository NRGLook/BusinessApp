from uuid import UUID
from typing import Optional

import sqlalchemy.exc
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import Depends, HTTPException

import src.models.managers as managers
from src.api.schemes import PaginationParams
from src.api.routes.education.course.schemes import (
    CourseReadSchema,
    CourseListResponseSchema,
    CourseCreateSchema,
    CourseDeleteSchema,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class CourseService(BaseService):
    def __init__(self, db: AsyncSession):
        self.course_manager = managers.CourseManager(db)

    async def get_courses(
        self,
        course_id: Optional[UUID],
        search: Optional[str],
        order_by: list[str],
        pagination: PaginationParams,
        **filters,
    ):
        filters["title__ilike"] = search
        courses = await self.course_manager.search(
            order_by=order_by,
            pagination=pagination,
            id=course_id,
            **filters,
        )
        total = await self.course_manager.count(
            id=course_id,
            **filters,
        )

        course_mapped = [self.map_obj_to_schema(course, CourseReadSchema).model_dump() for course in courses]

        return CourseListResponseSchema.create(list_data=course_mapped, pagination=pagination, total=total)

    async def create_or_update_courses(
        self,
        courses: list[CourseCreateSchema],
    ) -> list:
        """
        Create or update courses based on the provided data.
        """
        course_create_update = [CourseCreateSchema(**course.model_dump()) for course in courses]

        try:
            updated_courses = await self.course_manager.create_or_update(course_create_update)
        except sqlalchemy.exc.IntegrityError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e),
            )

        return updated_courses

    async def delete_courses(
        self,
        courses: list[CourseDeleteSchema],
    ) -> None:
        """
        Delete courses based on the provided list of IDs.
        """
        try:
            for course in courses:
                if course.id is not None:
                    await self.course_manager.delete_by_id(course.id)
        except sqlalchemy.exc.IntegrityError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e),
            )


async def get_course_service(
    db: AsyncSession = Depends(get_session),
) -> CourseService:
    return CourseService(db=db)
