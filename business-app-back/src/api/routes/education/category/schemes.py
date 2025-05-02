from typing import Optional

from pydantic import BaseModel


class CourseCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CourseCategoryCreate(CourseCategoryBase):
    pass


class CourseCategoryUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]


class CourseCategoryRead(CourseCategoryBase):
    id: int

    class Config:
        from_attributes = True
