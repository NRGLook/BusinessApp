from typing import Optional
from uuid import UUID

from pydantic import BaseModel, HttpUrl, Field

from src.api.schemes import ListDataResponseSchema, IDSchema


class LessonBaseSchema(IDSchema):
    title: str
    course_id: UUID
    content: Optional[str] = None
    order: int
    lesson_url: Optional[HttpUrl] = Field(None, description="Ссылка на внешний ресурс урока")


class LessonReadSchema(LessonBaseSchema):
    class Config:
        from_attributes = True


class LessonCreateSchema(LessonBaseSchema):
    pass


class LessonCreateBatchSchema(BaseModel):
    data: list[LessonCreateSchema]


class LessonUpdateSchema(BaseModel):
    name: Optional[str]
    description: Optional[str]
    course_id: Optional[int]


class LessonDeleteSchema(IDSchema):
    pass


class LessonDeleteBatchSchema(BaseModel):
    data: list[LessonDeleteSchema]


class LessonListResponseSchema(ListDataResponseSchema):
    data: list[LessonReadSchema]
