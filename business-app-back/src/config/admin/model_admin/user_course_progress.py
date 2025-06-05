from src.config.admin.categories import STATISTICS_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import UserCourseProgress


class UserCourseProgressAdmin(BaseAdmin, model=UserCourseProgress):  # type: ignore[call-arg]
    category = STATISTICS_CATEGORY
    name = "Статистика пользователя по курсу"
    name_plural = "Статистика пользователя по курсу"
    icon = "fa-solid fa-gauge"

    column_list = [
        UserCourseProgress.id,
        UserCourseProgress.user_id,
        UserCourseProgress.course_id,
        UserCourseProgress.completed_lessons,
        UserCourseProgress.is_completed,
        UserCourseProgress.user,
        UserCourseProgress.course,
    ]
    column_details_list = [
        UserCourseProgress.id,
        UserCourseProgress.user_id,
        UserCourseProgress.course_id,
        UserCourseProgress.completed_lessons,
        UserCourseProgress.is_completed,
        UserCourseProgress.user,
        UserCourseProgress.course,
    ]
    form_columns = [
        UserCourseProgress.id,
        UserCourseProgress.user_id,
        UserCourseProgress.course_id,
        UserCourseProgress.completed_lessons,
        UserCourseProgress.is_completed,
        UserCourseProgress.user,
        UserCourseProgress.course,
    ]
    column_searchable_list = [
        UserCourseProgress.id,
        UserCourseProgress.user_id,
        UserCourseProgress.course_id,
        UserCourseProgress.completed_lessons,
        UserCourseProgress.is_completed,
        UserCourseProgress.user,
        UserCourseProgress.course,
    ]
