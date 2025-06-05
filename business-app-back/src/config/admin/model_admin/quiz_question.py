from src.config.admin.categories import EDUCATION_CATEGORY
from src.config.admin.model_admin.base_admin import BaseAdmin
from src.models.dbo.database_models import QuizQuestion


class QuizQuestionAdmin(BaseAdmin, model=QuizQuestion):  # type: ignore[call-arg]
    category = EDUCATION_CATEGORY
    name = "Вопросы уроков"
    name_plural = "Вопросы уроков"
    icon = "fa-solid fa-chalkboard-user"

    column_list = [
        QuizQuestion.id,
        QuizQuestion.lesson_id,
        QuizQuestion.question_text,
        QuizQuestion.choices,
        QuizQuestion.correct_answer,
        QuizQuestion.lesson,
    ]
    column_details_list = [
        QuizQuestion.id,
        QuizQuestion.lesson_id,
        QuizQuestion.question_text,
        QuizQuestion.choices,
        QuizQuestion.correct_answer,
        QuizQuestion.lesson,
    ]
    form_columns = [
        QuizQuestion.id,
        QuizQuestion.lesson_id,
        QuizQuestion.question_text,
        QuizQuestion.choices,
        QuizQuestion.correct_answer,
        QuizQuestion.lesson,
    ]
    column_searchable_list = [
        QuizQuestion.id,
        QuizQuestion.lesson_id,
        QuizQuestion.question_text,
        QuizQuestion.choices,
        QuizQuestion.correct_answer,
        QuizQuestion.lesson,
    ]
