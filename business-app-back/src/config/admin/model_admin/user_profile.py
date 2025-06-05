from src.config.admin.categories import USER_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import UserProfile


class UserProfileAdmin(BaseAdmin, model=UserProfile):  # type: ignore[call-arg]
    category = USER_CATEGORY
    name = "Профили пользователя"
    name_plural = "Профиль пользователя"
    icon = "fa-solid fa-user-pen"

    column_list = [
        UserProfile.id,
        UserProfile.user_id,
        UserProfile.first_name,
        UserProfile.last_name,
        UserProfile.avatar_url,
        UserProfile.bio,
        UserProfile.user,
    ]
    column_details_list = [
        UserProfile.id,
        UserProfile.user_id,
        UserProfile.first_name,
        UserProfile.last_name,
        UserProfile.avatar_url,
        UserProfile.bio,
        UserProfile.user,
    ]
    form_columns = [
        UserProfile.id,
        UserProfile.user_id,
        UserProfile.first_name,
        UserProfile.last_name,
        UserProfile.avatar_url,
        UserProfile.bio,
        UserProfile.user,
    ]
    column_searchable_list = [
        UserProfile.id,
        UserProfile.user_id,
        UserProfile.first_name,
        UserProfile.last_name,
        UserProfile.avatar_url,
        UserProfile.bio,
        UserProfile.user,
    ]
