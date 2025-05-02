from uuid import UUID
from typing import Optional

import sqlalchemy.exc
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import Depends, HTTPException

import src.models.managers as managers
from src.api.schemes import PaginationParams
from src.api.routes.education.category.schemes import (
    CourseCategoryReadSchema,
    CourseCategoryListResponseSchema,
    CourseCategoryCreateSchema,
    CourseCategoryDeleteSchema,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class CourseCategoryService(BaseService):
    def __init__(self, db: AsyncSession):
        self.category_manager = managers.CourseCategoryManager(db)

    async def get_categories(
        self,
        category_id: Optional[UUID],
        search: Optional[str],
        order_by: list[str],
        pagination: PaginationParams,
        **filters,
    ):
        filters["name__ilike"] = search
        categories: list = await self.category_manager.search(
            order_by=order_by,
            pagination=pagination,
            id=category_id,
            **filters,
        )
        total = await self.category_manager.count(
            id=category_id,
            **filters,
        )

        categories_mapped = [
            self.map_obj_to_schema(category, CourseCategoryReadSchema).model_dump() for category in categories
        ]

        return CourseCategoryListResponseSchema.create(list_data=categories_mapped, pagination=pagination, total=total)

    async def create_or_update_categories(
        self,
        categories: list[CourseCategoryCreateSchema],
    ) -> list:
        """
        Create, update course category based on the provided data.
        """
        category_create_update = []

        for category in categories:
            category_create_update.append(
                CourseCategoryCreateSchema(
                    **category.model_dump(),
                )
            )

        try:
            updated_category = await self.category_manager.create_or_update(category_create_update)
        except sqlalchemy.exc.IntegrityError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e),
            )

        return updated_category

    async def delete_categories(
        self,
        categories: list[CourseCategoryDeleteSchema],
    ) -> None:
        """
        Delete course categories based on the provided list of IDs.
        """
        try:
            for category in categories:
                if category.id is not None:
                    await self.category_manager.delete_by_id(category.id)
        except sqlalchemy.exc.IntegrityError as e:
            raise HTTPException(
                status_code=400,
                detail=str(e),
            )


async def get_course_category_service(
    db: AsyncSession = Depends(get_session),
) -> CourseCategoryService:
    """
    Dependency injection function that provides an instance of CourseCategoryService with a database session.
    """
    return CourseCategoryService(db=db)
