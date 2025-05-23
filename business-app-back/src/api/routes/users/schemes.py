from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel

from fastapi_users import schemas

from src.api.schemes import NamedEntitySchema, IDSchema


class UserRead(schemas.BaseUser[UUID]):
    pass


class UserCreate(schemas.BaseUserCreate):
    pass


class UserUpdate(schemas.BaseUserUpdate):
    pass


class UserProfileSchema(IDSchema):
    first_name: Optional[str]
    last_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]


class UserStatsSchema(BaseModel):
    total_business: Optional[int]
    total_capital: Optional[float]
    success_rate: Optional[float]


class RoleSchema(NamedEntitySchema):
    pass


class AchievementSchema(NamedEntitySchema):
    pass


class UserProfileOutSchema(BaseModel):
    id: Optional[UUID]
    email: Optional[str]
    is_active: Optional[bool]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    user_profile: Optional[UserProfileSchema]
    user_stats: Optional[List[UserStatsSchema]]
    role: Optional[List[RoleSchema]]
    achievement: Optional[List[AchievementSchema]]


class UserProfileResponse(BaseModel):
    data: List[UserProfileOutSchema]


class UserEmailOutSchema(BaseModel):
    email: Optional[str]


class UserProfileCreateWithUserSchema(UserProfileSchema, IDSchema):
    user_id: UUID


class UserProfileCreateBatchSchema(BaseModel):
    data: list[UserProfileCreateWithUserSchema]
