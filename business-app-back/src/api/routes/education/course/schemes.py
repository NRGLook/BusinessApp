from uuid import UUID
from typing import Optional

from pydantic import BaseModel

from src.api.schemes import ListDataResponseSchema


class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: UUID


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    category_id: Optional[int]


class CourseRead(CourseBase):
    id: UUID

    class Config:
        from_attributes = True


class CourseListResponseSchema(ListDataResponseSchema):
    data: list[CourseRead]
