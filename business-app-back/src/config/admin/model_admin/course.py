from src.config.admin.categories import EDUCATION_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Course


class CourseAdmin(BaseAdmin, model=Course):  # type: ignore[call-arg]
    category = EDUCATION_CATEGORY
    name = "Курсы"
    name_plural = "Курсы"
    icon = "fa-solid fa-graduation-cap"

    column_list = [
        Course.id,
        Course.title,
        Course.description,
        Course.is_active,
        Course.category_id,
        Course.lesson_url,
        Course.category,
        Course.lessons,
        Course.progress,
    ]
    column_details_list = [
        Course.id,
        Course.title,
        Course.description,
        Course.is_active,
        Course.category_id,
        Course.lesson_url,
        Course.category,
        Course.lessons,
        Course.progress,
    ]
    form_columns = [
        Course.id,
        Course.title,
        Course.description,
        Course.is_active,
        Course.category_id,
        Course.lesson_url,
        Course.category,
        Course.lessons,
        Course.progress,
    ]
    column_searchable_list = [
        Course.id,
        Course.title,
        Course.description,
        Course.is_active,
        Course.category_id,
        Course.lesson_url,
        Course.category,
        Course.lessons,
        Course.progress,
    ]
