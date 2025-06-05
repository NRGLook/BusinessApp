from src.config.admin.categories import EDUCATION_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import Lesson


class LessonAdmin(BaseAdmin, model=Lesson):  # type: ignore[call-arg]
    category = EDUCATION_CATEGORY
    name = "Уроки"
    name_plural = "Уроки"
    icon = "fa-solid fa-laptop-code"

    column_list = [
        Lesson.id,
        Lesson.course_id,
        Lesson.title,
        Lesson.content,
        Lesson.order,
        Lesson.lesson_url,
        Lesson.course,
        Lesson.quizzes,
    ]
    column_details_list = [
        Lesson.id,
        Lesson.course_id,
        Lesson.title,
        Lesson.content,
        Lesson.order,
        Lesson.lesson_url,
        Lesson.course,
        Lesson.quizzes,
    ]
    form_columns = [
        Lesson.id,
        Lesson.course_id,
        Lesson.title,
        Lesson.content,
        Lesson.order,
        Lesson.lesson_url,
        Lesson.course,
        Lesson.quizzes,
    ]
    column_searchable_list = [
        Lesson.id,
        Lesson.course_id,
        Lesson.title,
        Lesson.content,
        Lesson.order,
        Lesson.lesson_url,
        Lesson.course,
        Lesson.quizzes,
    ]
