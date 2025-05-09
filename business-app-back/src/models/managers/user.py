from sqlalchemy import select

from src.services.logger import LoggerProvider
from src.models.dbo.database_models import (
    User,
    Role,
    Achievement,
    UserStats,
    user_roles,
    user_achievements,
    UserProfile,
)

from .common import BaseManager

log = LoggerProvider().get_logger(__name__)


class UserManager(BaseManager):
    entity = User

    join_columns = {
        "user_profile_first_name": UserProfile.first_name,
        "user_profile_last_name": UserProfile.last_name,
        "user_profile_avatar_url": UserProfile.avatar_url,
        "user_profile_bio": UserProfile.bio,
        "user_stats_total_business": UserStats.total_businesses,
        "user_stats_total_capital": UserStats.total_capital,
        "user_stats_success_rate": UserStats.success_rate,
        "role_id": Role.id,
        "role_name": Role.name,
        "achievement_id": Achievement.id,
        "achievement_name": Achievement.name,
    }

    def get_base_query(
        self,
    ):
        query = (
            select(
                User.email,
                User.id,
                User.is_active,
                User.created_at,
                User.updated_at,
                UserProfile.first_name.label("user_profile_first_name"),
                UserProfile.last_name.label("user_profile_last_name"),
                UserProfile.avatar_url.label("user_profile_avatar_url"),
                UserProfile.bio.label("user_profile_bio"),
                UserStats.total_businesses.label("user_stats_total_business"),
                UserStats.total_capital.label("user_stats_total_capital"),
                UserStats.success_rate.label("user_stats_success_rate"),
                Role.id.label("role_id"),
                Role.name.label("role_name"),
                Achievement.id.label("achievement_id"),
                Achievement.name.label("achievement_name"),
            )
            .join(UserProfile, User.id == UserProfile.user_id, isouter=True)
            .join(UserStats, User.id == UserStats.user_id, isouter=True)
            .join(user_roles, User.id == user_roles.c.user_id, isouter=True)
            .join(Role, user_roles.c.role_id == Role.id, isouter=True)
            .join(user_achievements, User.id == user_achievements.c.user_id, isouter=True)
            .join(
                Achievement,
                user_achievements.c.achievement_id == Achievement.id,
                isouter=True,
            )
        )

        return query
