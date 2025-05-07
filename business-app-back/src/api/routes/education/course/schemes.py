from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from src.api.schemes import ListDataResponseSchema, IDSchema


class CourseBaseSchema(IDSchema):
    title: str
    description: Optional[str] = None
    is_active: bool = Field(
        default=True,
        description="Флаг активности курса",
    )
    category_id: Optional[UUID] = Field(
        None,
        description="ID категории курса",
    )
    lesson_url: Optional[str] = Field(
        None,
        description="Ссылка на видеоурок по всему курсу",
    )


class CourseReadSchema(CourseBaseSchema):
    class Config:
        from_attributes = True


class CourseCreateSchema(CourseBaseSchema):
    pass


class CourseCreateBatchSchema(BaseModel):
    data: list[CourseCreateSchema]


class CourseUpdateSchema(BaseModel):
    title: Optional[str]
    description: Optional[str]
    is_active: Optional[bool]
    category_id: Optional[UUID]


class CourseDeleteSchema(IDSchema):
    pass


class CourseDeleteBatchSchema(BaseModel):
    data: list[CourseDeleteSchema]


class CourseListResponseSchema(ListDataResponseSchema):
    data: list[CourseReadSchema]
