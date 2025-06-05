from src.config.admin.categories import STATISTICS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Achievement


class AchievementAdmin(BaseAdmin, model=Achievement):  # type: ignore[call-arg]
    category = STATISTICS_CATEGORY
    name = "Достижения"
    name_plural = "Достижения"
    icon = "fa-solid fa-chart-pie"

    column_list = [
        Achievement.id,
        Achievement.name,
        Achievement.description,
        Achievement.icon_url,
        Achievement.users,
    ]
    column_details_list = [
        Achievement.id,
        Achievement.name,
        Achievement.description,
        Achievement.icon_url,
        Achievement.users,
    ]
    form_columns = [
        Achievement.id,
        Achievement.name,
        Achievement.description,
        Achievement.icon_url,
        Achievement.users,
    ]
    column_searchable_list = [
        Achievement.id,
        Achievement.name,
        Achievement.description,
        Achievement.icon_url,
        Achievement.users,
    ]
