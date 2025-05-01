from typing import Annotated, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.api.schemes import (
    Response400Schema,
    Response500Schema,
)
from src.api.routes.businesses.schemes import (
    BusinessSchema,
    BusinessCreateSchema,
    BusinessUpdateSchema,
    BusinessListResponseSchema,
    BusinessStructureListResponseSchema,
    BusinessStatsSchema,
    BusinessType
)
from src.services.businesses.business import BusinessService, get_business_service
from src.utils.helpers import pagination_params
from src.api.schemes import OrderParams

business_router = APIRouter(
    prefix="/business",
    tags=["Business"],
)

common_responses = {
    400: {"model": Response400Schema, "description": "Invalid request parameters",},
    500: {"model": Response500Schema, "description": "Internal server error",}
}

@business_router.get(
    "",
    response_model=BusinessListResponseSchema,
    responses={
        **common_responses,
        200: {
            "description": "List of businesses retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "data": [
                            {
                                "id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
                                "name": "My Factory",
                                "description": "Automobile parts manufacturing",
                                "business_type": "physical",
                                "owner_id": "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9",
                                "created_at": "2024-01-01T00:00:00Z",
                                "updated_at": "2024-01-02T00:00:00Z"
                            }
                        ],
                        "total": 1,
                        "page": 1,
                        "size": 10
                    }
                }
            }
        }
    },
    summary="Get list of businesses with pagination and filtering"
)
async def get_businesses(
    business_type: Optional[BusinessType] = Query(None),
    search: Optional[str] = Query(None, description="Search by business name"),
    pagination: dict = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: BusinessService = Depends(get_business_service)
):
    try:
        return await service.get_businesses(
            business_type=business_type,
            search=search,
            pagination=pagination,
            order_by=order_by.model_dump()["order_by"]
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"detail": str(e), "code": "validation_error"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"detail": "Internal server error", "code": "server_error"}
        )
