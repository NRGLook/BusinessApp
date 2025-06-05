from src.config.admin.categories import USER_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import UserStats


class UserStatsAdmin(BaseAdmin, model=UserStats):  # type: ignore[call-arg]
    category = USER_CATEGORY
    name = "Статистика пользователей"
    name_plural = "Статистика пользователей"
    icon = "fa-solid fa-id-badge"

    column_list = [
        UserStats.id,
        UserStats.user_id,
        UserStats.total_businesses,
        UserStats.total_capital,
        UserStats.success_rate,
        UserStats.user,
    ]
    column_details_list = [
        UserStats.id,
        UserStats.user_id,
        UserStats.total_businesses,
        UserStats.total_capital,
        UserStats.success_rate,
        UserStats.user,
    ]
    form_columns = [
        UserStats.id,
        UserStats.user_id,
        UserStats.total_businesses,
        UserStats.total_capital,
        UserStats.success_rate,
        UserStats.user,
    ]
    column_searchable_list = [
        UserStats.id,
        UserStats.user_id,
        UserStats.total_businesses,
        UserStats.total_capital,
        UserStats.success_rate,
        UserStats.user,
    ]
