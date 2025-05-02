from enum import Enum
from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field

from src.api.schemes import ListDataResponseSchema


class BusinessType(str, Enum):
    PHYSICAL = "PHYSICAL"
    VIRTUAL = "VIRTUAL"


class BusinessSchema(BaseModel):
    id: UUID
    name: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    business_type: BusinessType
    owner_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None


class BusinessCreateSchema(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    business_type: BusinessType
    initial_capital: Optional[float] = Field(10000.0, ge=0)


class BusinessBase(BaseModel):
    id: Optional[UUID] = None
    name: str
    description: Optional[str] = None
    business_type: str  # "PHYSICAL" или "VIRTUAL"
    initial_investment: float
    current_value: Optional[float] = None
    employees_count: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    level: Optional[int] = 1
    progress: Optional[float] = 0.0
    visualization_id: Optional[str] = None

    model_config = {"from_attributes": True}


class BusinessCreate(BusinessBase):
    pass


class BusinessCreateWithUser(BusinessBase):
    user_id: UUID


class BusinessCreateBatch(BaseModel):
    data: List[BusinessCreate]


class BusinessUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class BusinessListResponseSchema(ListDataResponseSchema):
    data: list[BusinessSchema]


class BusinessStructureItemType(str, Enum):
    FACTORY = "factory"
    DEPARTMENT = "department"
    WAREHOUSE = "warehouse"
    PRODUCTION_LINE = "production_line"
