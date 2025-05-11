from uuid import UUID

from fastapi import (
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.ext.asyncio import AsyncSession

import src.models.managers as managers
from src.api.routes.users.schemes import (
    UserProfileResponse,
    UserProfileSchema,
    UserStatsSchema,
    RoleSchema,
    AchievementSchema,
    UserProfileOutSchema,
    UserEmailOutSchema,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class UserService(BaseService):
    def __init__(
        self,
        db: AsyncSession,
    ):
        self.user_manager = managers.UserManager(db)
        self.base_fields = {
            "user_profile": UserProfileSchema,
            "user_stats": UserStatsSchema,
            "role": RoleSchema,
            "achievement": AchievementSchema,
        }

    def map_user_info(
        self,
        user,
    ) -> UserProfileOutSchema:
        achievements = []
        roles = []
        user_stats = []

        if user.achievement_id and user.achievement_name:
            achievements.append(
                AchievementSchema(
                    id=user.achievement_id,
                    name=user.achievement_name,
                )
            )

        if user.role_id and user.role_name:
            roles.append(
                RoleSchema(
                    id=user.role_id,
                    name=user.role_name,
                )
            )

        if user.user_stats_total_business is not None:
            user_stats.append(
                UserStatsSchema(
                    total_business=user.user_stats_total_business,
                    total_capital=user.user_stats_total_capital,
                    success_rate=user.user_stats_success_rate,
                )
            )

        return UserProfileOutSchema(
            id=user.id,
            email=user.email,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at,
            user_profile=UserProfileSchema(
                first_name=user.user_profile_first_name,
                last_name=user.user_profile_last_name,
                avatar_url=user.user_profile_avatar_url,
                bio=user.user_profile_bio,
            ),
            user_stats=user_stats,
            role=roles,
            achievement=achievements,
        )

    async def get_user_profile_info(
        self,
        user_id: UUID,
        **filters,
    ):
        user_profile_query = self.user_manager.get_user_info_query(user_id)
        users = await self.user_manager.search(
            query=user_profile_query,
            with_scalars=False,
            id=user_id,
            **filters,
        )

        user_profiles = {}
        for user in users:
            if user.id not in user_profiles:
                user_profiles[user.id] = self.map_user_info(user)
            else:
                current_achievements = user_profiles[user.id].achievement or []
                current_roles = user_profiles[user.id].role or []
                current_stats = user_profiles[user.id].user_stats or []

                if user.achievement_id and user.achievement_name:
                    if not any(ach.id == user.achievement_id for ach in current_achievements):
                        current_achievements.append(
                            AchievementSchema(
                                id=user.achievement_id,
                                name=user.achievement_name,
                            )
                        )

                if user.role_id and user.role_name:
                    if not any(role.id == user.role_id for role in current_roles):
                        current_roles.append(
                            RoleSchema(
                                id=user.role_id,
                                name=user.role_name,
                            )
                        )

                if user.user_stats_total_business is not None:
                    current_stats.append(
                        UserStatsSchema(
                            total_business=user.user_stats_total_business,
                            total_capital=user.user_stats_total_capital,
                            success_rate=user.user_stats_success_rate,
                        )
                    )

                user_profiles[user.id].achievement = current_achievements
                user_profiles[user.id].role = current_roles
                user_profiles[user.id].user_stats = current_stats

        return UserProfileResponse(data=list(user_profiles.values()))

    async def get_user_email(
        self,
        user_id: UUID,
        **filters,
    ) -> UserEmailOutSchema:
        try:
            users = await self.user_manager.search(
                id=user_id,
                with_scalars=False,
            )

            if not users:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found",
                )

            user = users[0]

            log.info(f"User email requested for ID: {user_id}")

            return UserEmailOutSchema(email=user.email)

        except Exception as e:
            log.error(f"Error getting user email: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error retrieving user email",
            )


async def get_user_service(
    db: AsyncSession = Depends(get_session),
) -> UserService:
    """
    Dependency injection function that provides an instance of BusinessService with a database session.
    """
    return UserService(db=db)
