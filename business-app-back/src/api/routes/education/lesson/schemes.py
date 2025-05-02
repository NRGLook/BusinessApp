from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from src.api.schemes import ListDataResponseSchema


class LessonBase(BaseModel):
    name: str
    description: Optional[str] = None
    course_id: int


class LessonCreate(LessonBase):
    pass


class LessonUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    course_id: Optional[int]


class LessonRead(LessonBase):
    id: UUID

    class Config:
        from_attributes = True


class LessonListResponseSchema(ListDataResponseSchema):
    data: list[LessonRead]
