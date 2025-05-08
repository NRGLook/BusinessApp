from decimal import Decimal
from typing import Optional, List
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict
from src.api.schemes import ListDataResponseSchema, IDSchema


class PhysicalBusinessSettingsSchema(BaseModel):
    location: str = Field(..., max_length=255)
    size_sq_meters: Decimal = Field(..., gt=0)
    employee_count: int = Field(..., gt=0)
    average_salary: Decimal = Field(..., gt=0)
    rent_cost: Decimal = Field(..., ge=0)
    equipment_maintenance_cost: Decimal = Field(..., ge=0)
    tax_rate: Decimal = Field(default=0.15, ge=0, le=1)
    utilities_cost: Decimal = Field(..., ge=0)
    marketing_budget: Decimal = Field(..., ge=0)
    equipment: dict = Field(..., example={"станки": 5})


class PhysicalBusinessSettingsBaseSchema(IDSchema):
    business_id: UUID
    location: str = Field(..., max_length=255)
    size_sq_meters: Decimal = Field(..., gt=0)
    employee_count: int = Field(..., gt=0)
    average_salary: Decimal = Field(..., gt=0)
    rent_cost: Decimal = Field(..., ge=0)
    equipment_maintenance_cost: Decimal = Field(..., ge=0)
    tax_rate: Decimal = Field(default=0.15, ge=0, le=1)
    utilities_cost: Decimal = Field(..., ge=0)
    marketing_budget: Decimal = Field(..., ge=0)
    equipment: dict = Field(..., example={"станки": 5})

    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class PhysicalBusinessSettingsCreateSchema(IDSchema):
    business_id: UUID
    location: str = Field(..., max_length=255)
    size_sq_meters: Decimal = Field(..., gt=0)
    employee_count: int = Field(..., gt=0)
    average_salary: Decimal = Field(..., gt=0)
    rent_cost: Decimal = Field(..., ge=0)
    equipment_maintenance_cost: Decimal = Field(..., ge=0)
    tax_rate: Decimal = Field(default=0.15, ge=0, le=1)
    utilities_cost: Decimal = Field(..., ge=0)
    marketing_budget: Decimal = Field(..., ge=0)
    equipment: dict = Field(..., example={"станки": 5})


class PhysicalBusinessSettingsUpdateSchema(IDSchema):
    business_id: UUID
    location: Optional[str] = Field(None, max_length=255)
    size_sq_meters: Optional[Decimal] = Field(None, gt=0)
    employee_count: Optional[int] = Field(None, gt=0)
    average_salary: Optional[Decimal] = Field(None, gt=0)
    rent_cost: Optional[Decimal] = Field(None, ge=0)
    equipment_maintenance_cost: Optional[Decimal] = Field(None, ge=0)
    tax_rate: Optional[Decimal] = Field(None, ge=0, le=1)
    utilities_cost: Optional[Decimal] = Field(None, ge=0)
    marketing_budget: Optional[Decimal] = Field(None, ge=0)
    equipment: Optional[dict] = Field(None, example={"станки": 5})


class PhysicalBusinessCreateWithUserSchema(PhysicalBusinessSettingsCreateSchema):
    owner_id: UUID


class PhysicalBusinessListResponseSchema(ListDataResponseSchema):
    data: List[PhysicalBusinessSettingsBaseSchema]


class PhysicalBusinessCreateBatchSchema(BaseModel):
    data: List[PhysicalBusinessSettingsCreateSchema]


class PhysicalBusinessCreateWithUserBatchSchema(BaseModel):
    data: List[PhysicalBusinessCreateWithUserSchema]


class PhysicalBusinessDeleteBatchSchema(BaseModel):
    data: List[UUID]
