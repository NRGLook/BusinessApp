from src.config.admin.categories import NOTIFICATION_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Notification


class NotificationAdmin(BaseAdmin, model=Notification):  # type: ignore[call-arg]
    category = NOTIFICATION_CATEGORY
    name = "Уведомления"
    name_plural = "Уведомления"
    icon = "fa-solid fa-bell"

    column_list = [
        Notification.id,
        Notification.user_id,
        Notification.title,
        Notification.is_read,
        Notification.message,
        Notification.user,
    ]
    column_details_list = [
        Notification.id,
        Notification.user_id,
        Notification.title,
        Notification.is_read,
        Notification.message,
        Notification.user,
    ]
    form_columns = [
        Notification.id,
        Notification.user_id,
        Notification.title,
        Notification.is_read,
        Notification.message,
        Notification.user,
    ]
    column_searchable_list = [
        Notification.id,
        Notification.user_id,
        Notification.title,
        Notification.is_read,
        Notification.message,
        Notification.user,
    ]
