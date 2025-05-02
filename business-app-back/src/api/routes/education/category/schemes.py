from typing import Optional

from pydantic import BaseModel

from src.api.schemes import IDSchema, ListDataResponseSchema


class CourseCategoryBaseSchema(IDSchema):
    name: str
    description: Optional[str] = None


class CourseCategoryReadSchema(CourseCategoryBaseSchema):
    class Config:
        from_attributes = True


class CourseCategoryCreateSchema(CourseCategoryBaseSchema):
    pass


class CourseCategoryCreateBatchSchema(BaseModel):
    data: list[CourseCategoryCreateSchema]


class CourseCategoryUpdateSchema(CourseCategoryBaseSchema):
    pass


class CourseCategoryDeleteSchema(IDSchema):
    pass


class CourseCategoryDeleteBatchSchema(BaseModel):
    data: list[CourseCategoryDeleteSchema]


class CourseCategoryListResponseSchema(ListDataResponseSchema):
    data: list[CourseCategoryReadSchema]
