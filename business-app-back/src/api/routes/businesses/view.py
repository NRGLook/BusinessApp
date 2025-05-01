from typing import Annotated, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src.api.schemes import (
    OrderParams,
    Response400Schema,
    Response500Schema,
    PaginationParams,
)
from src.api.routes.businesses.schemes import (
    BusinessSchema,
    BusinessCreateSchema,
    BusinessUpdateSchema,
    BusinessListResponseSchema,
    BusinessStructureListResponseSchema,
    BusinessStatsSchema,
    BusinessType,
)
from src.services.businesses.business import (
    BusinessService,
    get_business_service,
)
from src.utils.helpers import pagination_params

business_router = APIRouter(
    prefix="/business",
    tags=["Business"],
)

@business_router.get(
    "",
    responses={
        200: {
            "model": BusinessListResponseSchema,
            "description": "Businesses found successfully",
        },
        400: {
            "model": Response400Schema,
            "description": "Invalid request",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve businesses with search, sorting, and pagination",
)
async def get_businesses(
    search: Optional[str] = Query(None, description="Search by business name"),
    business_type: Optional[BusinessType] = Query(None),
    pagination: PaginationParams = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: BusinessService = Depends(get_business_service)
):
    try:
        return await service.get_businesses(
            business_type=business_type,
            search=search,
            pagination=pagination,
            order_by=order_by.model_dump()["order_by"],
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )
