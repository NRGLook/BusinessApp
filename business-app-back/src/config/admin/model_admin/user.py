from src.config.admin.categories import USER_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import User
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class UserAdmin(BaseAdmin, model=User):  # type: ignore[call-arg]
    category = USER_CATEGORY
    name = "Пользователь"
    name_plural = "Пользователи"
    icon = "fa-solid fa-user"

    column_list = [
        User.id,
        User.email,
    ]
    column_details_list = [
        User.id,
        User.email,
    ]
    form_columns = [
        User.email,
    ]
    column_searchable_list = [
        User.id,
        User.email,
    ]
