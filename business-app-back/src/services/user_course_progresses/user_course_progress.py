from uuid import UUID
from typing import Optional

import sqlalchemy.exc
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import Depends, HTTPException

import src.models.managers as managers
from src.api.schemes import PaginationParams
from src.api.routes.education.user_course_progress.schemes import (
    UserCourseProgressReadSchema,
    UserCourseProgressListResponseSchema,
    UserCourseProgressCreateSchema,
    UserCourseProgressDeleteSchema,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class UserCourseProgressService(BaseService):
    def __init__(self, db: AsyncSession):
        self.progress_manager = managers.UserCourseProgressManager(db)

    async def get_user_progress(
        self,
        user_id: Optional[UUID],
        course_id: Optional[UUID],
        order_by: list[str],
        pagination: PaginationParams,
        **filters,
    ):
        """
        Retrieve a list of user course progress records.

        Parameters:
            user_id (UUID): Optional filter to retrieve progress for a specific user.
            course_id (UUID): Optional filter to retrieve progress for a specific course.
            order_by (list[str]): List of fields to order by.
            pagination (PaginationParams): Pagination parameters.
            filters (dict): Additional filtering conditions.

        Returns:
            UserCourseProgressListResponseSchema: List of progress records with pagination info.
        """
        if user_id:
            filters["user_id"] = user_id
        if course_id:
            filters["course_id"] = course_id

        progress_records = await self.progress_manager.search(
            order_by=order_by,
            pagination=pagination,
            **filters,
        )
        total = await self.progress_manager.count(**filters)

        mapped = [self.map_obj_to_schema(obj, UserCourseProgressReadSchema).model_dump() for obj in progress_records]

        return UserCourseProgressListResponseSchema.create(
            list_data=mapped,
            pagination=pagination,
            total=total,
        )

    async def create_or_update_progress(
        self,
        progress_list: list[UserCourseProgressCreateSchema],
    ) -> list:
        """
        Create or update user course progress records.

        Parameters:
            progress_list (list): List of progress schemas to create or update.

        Returns:
            list: List of updated or created progress objects.
        """
        try:
            return await self.progress_manager.create_or_update(progress_list)
        except sqlalchemy.exc.IntegrityError as e:
            log.error(f"Integrity error while creating/updating progress: {e}")
            raise HTTPException(status_code=400, detail=str(e))

    async def delete_progress(
        self,
        progress_list: list[UserCourseProgressDeleteSchema],
    ) -> None:
        """
        Delete user course progress records by ID.

        Parameters:
            progress_list (list): List of progress records to delete.
        """
        try:
            for item in progress_list:
                if item.id is not None:
                    await self.progress_manager.delete_by_id(item.id)
        except sqlalchemy.exc.IntegrityError as e:
            log.error(f"Error while deleting progress: {e}")
            raise HTTPException(status_code=400, detail=str(e))


async def get_user_course_progress_service(
    db: AsyncSession = Depends(get_session),
) -> UserCourseProgressService:
    """
    Dependency injection for UserCourseProgressService.

    Returns:
        UserCourseProgressService: Service with injected database session.
    """
    return UserCourseProgressService(db=db)
