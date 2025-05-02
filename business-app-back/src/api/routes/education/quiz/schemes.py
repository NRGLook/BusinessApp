from typing import List, Optional

from pydantic import BaseModel


class QuizQuestionBase(BaseModel):
    question_text: str
    answer_options: List[str]
    correct_answer: str
    lesson_id: int


class QuizQuestionCreate(QuizQuestionBase):
    pass


class QuizQuestionUpdate(BaseModel):
    question_text: Optional[str]
    answer_options: Optional[List[str]]
    correct_answer: Optional[str]
    lesson_id: Optional[int]


class QuizQuestionRead(QuizQuestionBase):
    id: int

    class Config:
        from_attributes = True
