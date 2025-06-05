from src.config.admin.categories import USER_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import UserBriefcase


class UserBriefcaseAdmin(BaseAdmin, model=UserBriefcase):  # type: ignore[call-arg]
    category = USER_CATEGORY
    name = "Портфолио (портфель) пользователя"
    name_plural = "Портфолио (портфель) пользователя"
    icon = "fa-solid fa-id-badge"

    column_list = [
        UserBriefcase.id,
        UserBriefcase.assets,
        UserBriefcase.balance,
        UserBriefcase.settings,
        UserBriefcase.settings_id,
    ]
    column_details_list = [
        UserBriefcase.id,
        UserBriefcase.assets,
        UserBriefcase.balance,
        UserBriefcase.settings,
        UserBriefcase.settings_id,
    ]
    form_columns = [
        UserBriefcase.id,
        UserBriefcase.assets,
        UserBriefcase.balance,
        UserBriefcase.settings,
        UserBriefcase.settings_id,
    ]
    column_searchable_list = [
        UserBriefcase.id,
        UserBriefcase.assets,
        UserBriefcase.balance,
        UserBriefcase.settings,
        UserBriefcase.settings_id,
    ]
