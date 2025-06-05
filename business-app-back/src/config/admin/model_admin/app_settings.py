from src.config.admin.categories import SETTINGS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import AppSettings


class AppSettingsAdmin(BaseAdmin, model=AppSettings):  # type: ignore[call-arg]
    category = SETTINGS_CATEGORY
    name = "Настройки приложения"
    name_plural = "Настройки приложения"
    icon = "fa-solid fa-gear"

    column_list = [
        AppSettings.id,
        AppSettings.key,
        AppSettings.value,
        AppSettings.description,
    ]
    column_details_list = [
        AppSettings.id,
        AppSettings.key,
        AppSettings.value,
        AppSettings.description,
    ]
    form_columns = [
        AppSettings.id,
        AppSettings.key,
        AppSettings.value,
        AppSettings.description,
    ]
    column_searchable_list = [
        AppSettings.id,
        AppSettings.key,
        AppSettings.value,
        AppSettings.description,
    ]
