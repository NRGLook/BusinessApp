from typing import List, Optional

from pydantic import BaseModel


class UserCourseProgressBase(BaseModel):
    user_id: int
    course_id: int
    completed_lessons: List[int]
    score: int


class UserCourseProgressCreate(UserCourseProgressBase):
    pass


class UserCourseProgressUpdate(BaseModel):
    completed_lessons: Optional[List[int]]
    score: Optional[int]


class UserCourseProgressRead(UserCourseProgressBase):
    id: int

    class Config:
        from_attributes = True
