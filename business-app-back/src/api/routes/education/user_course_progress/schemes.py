from typing import Optional
from uuid import UUID
from pydantic import BaseModel

from src.api.schemes import ListDataResponseSchema, IDSchema


class UserCourseProgressBaseSchema(IDSchema):
    user_id: UUID
    course_id: UUID
    completed_lessons: int
    is_completed: bool


class UserCourseProgressReadSchema(UserCourseProgressBaseSchema):
    class Config:
        from_attributes = True


class UserCourseProgressCreateSchema(UserCourseProgressBaseSchema):
    pass


class UserCourseProgressCreateBatchSchema(BaseModel):
    data: list[UserCourseProgressCreateSchema]


class UserCourseProgressUpdateSchema(BaseModel):
    completed_lessons: Optional[int] = None
    is_completed: Optional[bool] = None


class UserCourseProgressDeleteSchema(IDSchema):
    pass


class UserCourseProgressDeleteBatchSchema(BaseModel):
    data: list[UserCourseProgressDeleteSchema]


class UserCourseProgressListResponseSchema(ListDataResponseSchema):
    data: list[UserCourseProgressReadSchema]
