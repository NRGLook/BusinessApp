from enum import Enum
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class BusinessType(str, Enum):
    PHYSICAL = "physical"
    VIRTUAL = "virtual"


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


class BusinessUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)


class BusinessListResponseSchema(BaseModel):
    data: list[BusinessSchema]
    total: int
    page: int
    size: int


class BusinessStructureItemType(str, Enum):
    FACTORY = "factory"
    DEPARTMENT = "department"
    WAREHOUSE = "warehouse"
    PRODUCTION_LINE = "production_line"


class BusinessStructureSchema(BaseModel):
    id: UUID
    parent_id: Optional[UUID] = None
    name: str
    level: int
    type: BusinessStructureItemType
    sort_order: Optional[int] = None


class BusinessStructureListResponseSchema(BaseModel):
    data: list[BusinessStructureSchema]


class BusinessStatsSchema(BaseModel):
    total_capital: float
    total_employees: int
    monthly_profit: float
    success_rate: float = Field(..., ge=0, le=1)
