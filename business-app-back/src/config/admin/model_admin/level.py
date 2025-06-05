from src.config.admin.categories import STATISTICS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Level


class LevelAdmin(BaseAdmin, model=Level):  # type: ignore[call-arg]
    category = STATISTICS_CATEGORY
    name = "Уровни"
    name_plural = "Уровни"
    icon = "fa-solid fa-signal"

    column_list = [
        Level.id,
        Level.level_number,
        Level.required_xp,
        Level.title,
    ]
    column_details_list = [
        Level.id,
        Level.level_number,
        Level.required_xp,
        Level.title,
    ]
    form_columns = [
        Level.id,
        Level.level_number,
        Level.required_xp,
        Level.title,
    ]
    column_searchable_list = [
        Level.id,
        Level.level_number,
        Level.required_xp,
        Level.title,
    ]
