from decimal import Decimal
from typing import Optional, List
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict
from src.api.schemes import ListDataResponseSchema, IDSchema


class VirtualBusinessSettingsSchema(BaseModel):
    electricity_cost: Decimal = Field(..., ge=0)
    hardware_cost: Decimal = Field(..., ge=0)
    hashrate: int = Field(..., gt=0)
    mining_difficulty: int = Field(..., gt=0)
    pool_fees: Decimal = Field(default=0.02, ge=0, le=0.5)
    crypto_price: Decimal = Field(..., gt=0)
    risk_multiplier: Decimal = Field(default=1.0, ge=0.5, le=2.0)
    initial_capital: Decimal = Field(default=100000.0)
    risk_level: int = Field(default=3, ge=1, le=5)
    portfolio: dict = Field(..., example={"BTC": 60})


class VirtualBusinessSettingsBaseSchema(IDSchema):
    business_id: UUID
    electricity_cost: Decimal = Field(..., ge=0)
    hardware_cost: Decimal = Field(..., ge=0)
    hashrate: int = Field(..., gt=0)
    mining_difficulty: int = Field(..., gt=0)
    pool_fees: Decimal = Field(default=0.02, ge=0, le=0.5)
    crypto_price: Decimal = Field(..., gt=0)
    risk_multiplier: Decimal = Field(default=1.0, ge=0.5, le=2.0)
    initial_capital: Decimal = Field(default=100000.0)
    risk_level: int = Field(default=3, ge=1, le=5)
    portfolio: dict = Field(..., example={"BTC": 60})

    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class VirtualBusinessSettingsCreateSchema(IDSchema):
    business_id: UUID
    electricity_cost: Decimal = Field(..., ge=0)
    hardware_cost: Decimal = Field(..., ge=0)
    hashrate: int = Field(..., gt=0)
    mining_difficulty: int = Field(..., gt=0)
    pool_fees: Decimal = Field(default=0.02, ge=0, le=0.5)
    crypto_price: Decimal = Field(..., gt=0)
    risk_multiplier: Decimal = Field(default=1.0, ge=0.5, le=2.0)
    initial_capital: Decimal = Field(default=100000.0)
    risk_level: int = Field(default=3, ge=1, le=5)
    portfolio: dict = Field(..., example={"BTC": 60})


class VirtualBusinessSettingsUpdateSchema(IDSchema):
    business_id: UUID
    electricity_cost: Optional[Decimal] = Field(None, ge=0)
    hardware_cost: Optional[Decimal] = Field(None, ge=0)
    hashrate: Optional[int] = Field(None, gt=0)
    mining_difficulty: Optional[int] = Field(None, gt=0)
    pool_fees: Optional[Decimal] = Field(None, ge=0, le=0.5)
    crypto_price: Optional[Decimal] = Field(None, gt=0)
    risk_multiplier: Optional[Decimal] = Field(None, ge=0.5, le=2.0)
    initial_capital: Optional[Decimal] = Field(None)
    risk_level: Optional[int] = Field(None, ge=1, le=5)
    portfolio: Optional[dict] = Field(None, example={"BTC": 60})


class VirtualBusinessCreateWithUserSchema(VirtualBusinessSettingsCreateSchema):
    owner_id: UUID


class VirtualBusinessListResponseSchema(ListDataResponseSchema):
    data: List[VirtualBusinessSettingsBaseSchema]


class VirtualBusinessCreateBatchSchema(BaseModel):
    data: List[VirtualBusinessSettingsCreateSchema]


class VirtualBusinessCreateWithUserBatchSchema(BaseModel):
    data: List[VirtualBusinessCreateWithUserSchema]


class VirtualBusinessDeleteBatchSchema(BaseModel):
    data: List[UUID]
