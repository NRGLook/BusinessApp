from uuid import UUID
from typing import (
    Annotated,
    Optional,
)

from fastapi import (
    APIRouter,
    Depends,
    Query,
    HTTPException,
    status,
)

from src.api.routes.auth.fastapi_users_auth_router import (
    current_active_user,
)
from src.api.schemes import (
    OrderParams,
    Response400Schema,
    Response500Schema,
    PaginationParams,
    Response404Schema,
)
from src.api.routes.businesses.business_schemes import (
    BusinessListResponseSchema,
    BusinessType,
    BusinessBaseSchema,
    BusinessCreateBatchSchema,
    BusinessCreateWithUserBatchSchema,
)
from src.api.routes.businesses.physical_business_settings_schemes import (
    PhysicalBusinessCreateBatchSchema,
    PhysicalBusinessSettingsBaseSchema,
)
from src.api.routes.businesses.virtual_business_settings_schemes import (
    VirtualBusinessCreateBatchSchema,
    VirtualBusinessSettingsBaseSchema,
)
from src.models.dbo.database_models import User
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
    "/all",
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
    summary="Retrieve all businesses of all users with search, sorting, and pagination.",
)
async def get_businesses_for_all_user(
    user: Annotated[
        User,
        Depends(current_active_user),  # current_active_super_user
    ],
    business_id: Optional[UUID] = None,
    search: Optional[str] = Query(None, description="Search by business name"),
    business_type: Optional[BusinessType] = Query(None),
    pagination: PaginationParams = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: BusinessService = Depends(get_business_service),
):
    try:
        return await service.get_businesses(
            business_id=business_id,
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
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
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
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    business_id: Optional[UUID] = None,
    search: Optional[str] = Query(None, description="Search by business name"),
    business_type: Optional[BusinessType] = Query(None),
    pagination: PaginationParams = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: BusinessService = Depends(get_business_service),
):
    try:
        return await service.get_businesses(
            business_id=business_id,
            business_type=business_type,
            user_id=user.id,
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
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@business_router.get(
    "/{business_id}",
    responses={
        200: {
            "model": BusinessBaseSchema,
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
async def get_business_detail_information(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    business_id: Optional[UUID] = None,
    service: BusinessService = Depends(get_business_service),
):
    try:
        return await service.get_business_details(
            business_id=business_id,
            user_id=user.id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@business_router.post(
    "",
    responses={
        201: {
            "model": BusinessCreateWithUserBatchSchema,
            "description": "Business created/updated successfully",
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
    summary="Create, update business according to your provided data",
)
async def create_or_update_business(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    business: BusinessCreateBatchSchema,
    service: BusinessService = Depends(get_business_service),
):
    try:
        return await service.create_or_update_business(
            business.data,
            user_id=user.id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@business_router.get(
    "/{business_id}/physical-settings",
    responses={
        200: {
            "model": PhysicalBusinessSettingsBaseSchema,
            "description": "Physical business settings retrieved successfully",
        },
        400: {
            "model": Response400Schema,
            "description": "Invalid request",
        },
        404: {
            "model": Response404Schema,
            "description": "Physical business settings not found",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve physical business settings by business ID",
)
async def get_physical_business_settings(
    user: Annotated[User, Depends(current_active_user)],
    business_id: UUID,
    service: BusinessService = Depends(get_business_service),
):
    try:
        return await service.get_physical_settings(
            business_id=business_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
    except LookupError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "detail": "Physical business settings not found",
                "code": "not_found",
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@business_router.get(
    "/{business_id}/virtual-settings",
    responses={
        200: {
            "model": VirtualBusinessSettingsBaseSchema,
            "description": "Virtual business settings retrieved successfully",
        },
        400: {
            "model": Response400Schema,
            "description": "Invalid request",
        },
        404: {
            "model": Response404Schema,
            "description": "Virtual business settings not found",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve virtual business settings by business ID",
)
async def get_virtual_business_settings(
    user: Annotated[User, Depends(current_active_user)],
    business_id: UUID,
    service: BusinessService = Depends(get_business_service),
):
    try:
        return await service.get_virtual_settings(
            business_id=business_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
    except LookupError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "detail": "Virtual business settings not found",
                "code": "not_found",
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@business_router.post(
    "/physical-settings",
    responses={
        201: {
            "model": PhysicalBusinessCreateBatchSchema,
            "description": "Physical business settings created/updated successfully",
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
    summary="Create, update physical business settings according to your provided data",
)
async def create_or_update_physical_settings_business(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    physical_business: PhysicalBusinessCreateBatchSchema,
    service: BusinessService = Depends(get_business_service),
):
    try:
        return await service.create_or_update_physical_business_settings(
            physical_business.data,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@business_router.post(
    "/virtual-settings",
    responses={
        201: {
            "model": VirtualBusinessCreateBatchSchema,
            "description": "Virtual business settings created/updated successfully",
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
    summary="Create, update virtual business settings according to your provided data",
)
async def create_or_update_virtual_settings_business(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    virtual_business: VirtualBusinessCreateBatchSchema,
    service: BusinessService = Depends(get_business_service),
):
    try:
        return await service.create_or_update_virtual_business_settings(
            virtual_business.data,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "detail": str(e),
                "code": "validation_error",
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )
