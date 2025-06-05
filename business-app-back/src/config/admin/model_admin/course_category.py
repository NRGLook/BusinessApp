from src.config.admin.categories import EDUCATION_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import CourseCategory


class CourseCategoryAdmin(BaseAdmin, model=CourseCategory):  # type: ignore[call-arg]
    category = EDUCATION_CATEGORY
    name = "Категории курсов"
    name_plural = "Категории курсов"
    icon = "fa-solid fa-solid fa-book-open"

    column_list = [
        CourseCategory.id,
        CourseCategory.name,
        CourseCategory.description,
        CourseCategory.courses,
    ]
    column_details_list = [
        CourseCategory.id,
        CourseCategory.name,
        CourseCategory.description,
        CourseCategory.courses,
    ]
    form_columns = [
        CourseCategory.id,
        CourseCategory.name,
        CourseCategory.description,
        CourseCategory.courses,
    ]
    column_searchable_list = [
        CourseCategory.id,
        CourseCategory.name,
        CourseCategory.description,
        CourseCategory.courses,
    ]
