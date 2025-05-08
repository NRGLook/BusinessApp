from decimal import Decimal
from enum import Enum
from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict

from src.api.schemes import ListDataResponseSchema, IDSchema
from .physical_business_settings_schemes import PhysicalBusinessSettingsSchema
from .virtual_business_settings_schemes import VirtualBusinessSettingsSchema


class BusinessType(str, Enum):
    PHYSICAL = "PHYSICAL"
    VIRTUAL = "VIRTUAL"


class BusinessBaseSchema(IDSchema):
    name: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    business_type: BusinessType
    initial_investment: Decimal = Field(..., gt=0)
    operational_costs: Decimal = Field(default=0.0, ge=0)
    expected_revenue: Decimal = Field(..., ge=0)
    break_even_months: Optional[Decimal] = Field(None, ge=0)
    owner_id: UUID = Field(...)
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class BusinessCreateSchema(IDSchema):
    name: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    business_type: BusinessType
    initial_investment: Decimal = Field(..., gt=0)
    operational_costs: Decimal = Field(default=0.0, ge=0)
    expected_revenue: Decimal = Field(..., ge=0)


class BusinessCreateWithUserSchema(BusinessCreateSchema):
    owner_id: UUID


class BusinessUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    operational_costs: Optional[float] = Field(None, ge=0)
    expected_revenue: Optional[float] = Field(None, ge=0)
    physical_settings: Optional[PhysicalBusinessSettingsSchema] = None
    virtual_settings: Optional[VirtualBusinessSettingsSchema] = None


class BusinessResponseSchema(BusinessBaseSchema):
    owner_id: UUID
    physical_settings: Optional[PhysicalBusinessSettingsSchema] = None
    virtual_settings: Optional[VirtualBusinessSettingsSchema] = None


class BusinessListResponseSchema(ListDataResponseSchema):
    data: List[BusinessResponseSchema]


class BusinessStructureItemType(str, Enum):
    FACTORY = "factory"
    DEPARTMENT = "department"
    WAREHOUSE = "warehouse"
    PRODUCTION_LINE = "production_line"


class BusinessCreateBatchSchema(BaseModel):
    data: List[BusinessCreateSchema]


class BusinessCreateWithUserBatchSchema(BaseModel):
    data: List[BusinessCreateWithUserSchema]


class BusinessDeleteBatchSchema(BaseModel):
    data: List[UUID]
