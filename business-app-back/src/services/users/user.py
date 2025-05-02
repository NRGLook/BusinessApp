from typing import Optional

from fastapi import Depends

from sqlalchemy.ext.asyncio import AsyncSession

import src.models.managers as managers
from src.api.routes.users.schemes import (
    UserProfileResponse,
    UserProfileSchema,
    UserStatsSchema,
    RoleSchema,
    AchievementSchema,
    UserProfileOutSchema,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class UserService(BaseService):
    def __init__(self, db: AsyncSession):
        self.user_manager = managers.UserManager(db)
        self.base_fields = {
            "user_profile": UserProfileSchema,
            "user_stats": UserStatsSchema,
            "role": RoleSchema,
            "achievement": AchievementSchema,
        }

    def map_user(
        self,
        user,
    ) -> UserProfileOutSchema:
        nested_fields = {
            field: self.map_nested_fields(user, schema, field) for field, schema in self.base_fields.items()
        }

        return UserProfileOutSchema(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
            **nested_fields,
        )

    async def get_users(
        self,
        search: Optional[str],
        **filters,
    ):
        filters["name_ilike"] = search

        users = await self.user_manager.search(
            with_scalars=False,
            **filters,
        )

        return UserProfileResponse(data=[self.map_user(user).model_dump() for user in users])


async def get_user_service(
    db: AsyncSession = Depends(get_session),
) -> UserService:
    """
    Dependency injection function that provides an instance of BusinessService with a database session.
    """
    return UserService(db=db)
