from uuid import UUID
from typing import List

from pydantic import BaseModel, Field

from src.api.schemes import ListDataResponseSchema, IDSchema


class QuizQuestionBaseSchema(IDSchema):
    lesson_id: UUID = Field(..., description="ID урока, к которому относится вопрос")
    question_text: str = Field(..., description="Текст вопроса")
    choices: List[str] = Field(..., description="Варианты ответов (в формате списка строк)")
    correct_answer: str = Field(..., description="Правильный ответ")


class QuizQuestionReadSchema(QuizQuestionBaseSchema):
    class Config:
        from_attributes = True


class QuizQuestionCreateSchema(BaseModel):
    lesson_id: UUID
    question_text: str
    choices: List[str]
    correct_answer: str


class QuizQuestionCreateBatchSchema(BaseModel):
    data: List[QuizQuestionCreateSchema]


class QuizQuestionUpdateSchema(BaseModel):
    question_text: str | None = None
    choices: List[str] | None = None
    correct_answer: str | None = None


class QuizQuestionDeleteSchema(IDSchema):
    pass


class QuizQuestionDeleteBatchSchema(BaseModel):
    data: List[QuizQuestionDeleteSchema]


class QuizQuestionListResponseSchema(ListDataResponseSchema):
    data: List[QuizQuestionReadSchema]
