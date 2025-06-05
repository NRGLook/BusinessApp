from src.config.admin.categories import MESSAGE_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Message


class MessageAdmin(BaseAdmin, model=Message):  # type: ignore[call-arg]
    category = MESSAGE_CATEGORY
    name = "Сообщения"
    name_plural = "Сообщения"
    icon = "fa-solid fa-comments"

    column_list = [
        Message.id,
        Message.user_id,
        Message.content,
        Message.is_read,
        Message.user,
    ]
    column_details_list = [
        Message.id,
        Message.user_id,
        Message.content,
        Message.is_read,
        Message.user,
    ]
    form_columns = [
        Message.id,
        Message.user_id,
        Message.content,
        Message.is_read,
        Message.user,
    ]
    column_searchable_list = [
        Message.id,
        Message.user_id,
        Message.content,
        Message.is_read,
        Message.user,
    ]
