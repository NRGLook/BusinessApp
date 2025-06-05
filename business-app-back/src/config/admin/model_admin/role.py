from src.config.admin.categories import USER_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Role


class RoleAdmin(BaseAdmin, model=Role):  # type: ignore[call-arg]
    category = USER_CATEGORY
    name = "Роли"
    name_plural = "Роли"
    icon = "fa-solid fa-user-shield"

    column_list = [
        Role.id,
        Role.name,
        Role.description,
    ]
    column_details_list = [
        Role.id,
        Role.name,
        Role.description,
    ]
    form_columns = [
        Role.id,
        Role.name,
        Role.description,
    ]
    column_searchable_list = [
        Role.id,
        Role.name,
        Role.description,
    ]
