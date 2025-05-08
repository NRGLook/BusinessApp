from uuid import UUID
from typing import Optional, List

import sqlalchemy
from fastapi import (
    Depends,
    HTTPException,
    status,
)
from pydantic import BaseModel

from sqlalchemy.ext.asyncio import AsyncSession

import src.models.managers as managers
from src.api.schemes import PaginationParams
from src.api.routes.businesses.business_schemes import (
    BusinessBaseSchema,
    BusinessListResponseSchema,
    BusinessCreateSchema,
    BusinessCreateWithUserSchema,
    BusinessType,
)
from src.api.routes.businesses.physical_business_settings_schemes import (
    PhysicalBusinessSettingsCreateSchema,
    PhysicalBusinessSettingsBaseSchema,
)
from src.api.routes.businesses.virtual_business_settings_schemes import (
    VirtualBusinessSettingsCreateSchema,
    VirtualBusinessSettingsBaseSchema,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class BusinessService(BaseService):
    def __init__(self, db: AsyncSession):
        self.business_manager = managers.BusinessManager(db)
        self.physical_business_manager = managers.PhysicalBusinessManager(db)
        self.virtual_business_manager = managers.VirtualBusinessManager(db)

    async def get_businesses(
        self,
        business_id: Optional[UUID],
        business_type: Optional[str],
        search: Optional[str],
        order_by: list[str],
        pagination: PaginationParams,
        user_id: Optional[UUID] = None,
        **filters,
    ):
        """
        Retrieves a list of construction records from the database with optional search, sorting, and pagination
        parameters, along with additional filters.

        Parameters:
            search (Optional[str]): A search term used to filter constructions by name. If provided, performs a
                                    case-insensitive partial match on construction names.
            business_type (Optional[str]): filter by business_type.
            sort (SortParams): Defines the sorting field and order (e.g., ascending or descending) for the result set.
            pagination (PaginationParams): Contains pagination settings such as the page number and page size to limit
                                            the number of results returned.
            **filters: Additional keyword arguments used to apply custom filters on construction records (e.g.,
                        filtering by specific attributes).

        Returns:
            ConstructionListResponseSchema: A response schema object containing the list of constructions that match
            the provided criteria, as well as pagination details and the total count of records.
        """
        filters["name_ilike"] = search
        businesses: list = await self.business_manager.search(
            order_by=order_by,
            pagination=pagination,
            business_type=business_type,
            owner_id=user_id,
            id=business_id,
            **filters,
        )
        total = await self.business_manager.count(**filters)
        businesses_mapped = [
            self.map_obj_to_schema(business, BusinessBaseSchema).model_dump() for business in businesses
        ]

        return BusinessListResponseSchema.create(
            list_data=businesses_mapped,
            pagination=pagination,
            total=total,
        )

    async def get_business_details(
        self,
        business_id: Optional[UUID],
        user_id: UUID,
        **filters,
    ):
        """
        Retrieves a list of construction records from the database with optional search, sorting, and pagination
        parameters, along with additional filters.

        Parameters:
            search (Optional[str]): A search term used to filter constructions by name. If provided, performs a
                                    case-insensitive partial match on construction names.
            business_type (Optional[UUID]): filter by business_type.
            sort (SortParams): Defines the sorting field and order (e.g., ascending or descending) for the result set.
            pagination (PaginationParams): Contains pagination settings such as the page number and page size to limit
                                            the number of results returned.
            **filters: Additional keyword arguments used to apply custom filters on construction records (e.g.,
                        filtering by specific attributes).

        Returns:
            ConstructionListResponseSchema: A response schema object containing the list of constructions that match
            the provided criteria, as well as pagination details and the total count of records.
        """
        businesses: list = await self.business_manager.search(
            id=business_id,
            owner_id=user_id,
        )

        if not businesses:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Business not found",
            )

        return self.map_obj_to_schema(businesses[0], BusinessBaseSchema)

    async def create_or_update_business(
        self,
        businesses: List[BusinessCreateSchema],
        user_id: UUID,
    ):
        businesses_with_user = []
        for business in businesses:
            businesses_with_user.append(
                BusinessCreateWithUserSchema(
                    **business.model_dump(),
                    owner_id=user_id,
                )
            )

        try:
            updated_businesses = await self.business_manager.create_or_update(businesses_with_user)
        except sqlalchemy.exc.IntegrityError as e:
            log.error(f"Integrity error while creating businesses: {e}")
            raise HTTPException(
                status_code=400,
                detail="Business creation failed due to database constraints",
            )
        except Exception as e:
            log.error(f"Unexpected error while creating businesses: {e}")
            raise HTTPException(
                status_code=500,
                detail="Internal server error occurred",
            )

        return updated_businesses

    async def get_physical_settings(
        self,
        business_id: UUID,
        **filters,
    ) -> BaseModel:
        """
        Retrieves physical business settings for a specific business and user.

        Parameters:
            business_id (UUID): ID of the business.
            user_id (UUID): ID of the user requesting the data.

        Returns:
            PhysicalBusinessSettingsBaseSchema: The settings object.
        """
        settings = await self.physical_business_manager.search(
            business_id=business_id,
        )

        if not settings:
            raise LookupError("Physical business settings not found")

        return self.map_obj_to_schema(settings[0], PhysicalBusinessSettingsBaseSchema)

    async def get_virtual_settings(
        self,
        business_id: UUID,
    ) -> BaseModel:
        """
        Retrieves virtual business settings for a specific business and user.

        Parameters:
            business_id (UUID): ID of the business.
            user_id (UUID): ID of the user requesting the data.

        Returns:
            VirtualBusinessSettingsBaseSchema: The settings object.
        """
        settings = await self.virtual_business_manager.search(
            business_id=business_id,
        )

        if not settings:
            raise LookupError("Virtual business settings not found")

        return self.map_obj_to_schema(settings[0], VirtualBusinessSettingsBaseSchema)

    async def create_or_update_physical_business_settings(
        self,
        businesses: List[PhysicalBusinessSettingsCreateSchema],
    ):
        physical_businesses_settings = []
        for business in businesses:
            db_business = await self.business_manager.get_by_id(business.business_id)

            if not db_business:
                raise HTTPException(
                    status_code=404,
                    detail=f"Бизнес с id {business.business_id} не найден",
                )

            if db_business.business_type != BusinessType.PHYSICAL:
                raise HTTPException(
                    status_code=400,
                    detail=f"Бизнес с id {business.business_id} не является физическим",
                )

            physical_businesses_settings.append(
                PhysicalBusinessSettingsCreateSchema(
                    **business.model_dump(),
                )
            )

        try:
            updated_businesses = await self.physical_business_manager.create_or_update(physical_businesses_settings)
        except sqlalchemy.exc.IntegrityError as e:
            log.error(f"Integrity error while creating businesses: {e}")
            raise HTTPException(
                status_code=400,
                detail="Business creation failed due to database constraints",
            )
        except Exception as e:
            log.error(f"Unexpected error while creating businesses: {e}")
            raise HTTPException(
                status_code=500,
                detail="Internal server error occurred",
            )

        return updated_businesses

    async def create_or_update_virtual_business_settings(
        self,
        businesses: List[VirtualBusinessSettingsCreateSchema],
    ):
        virtual_businesses_settings = []
        for business in businesses:
            db_business = await self.business_manager.get_by_id(business.business_id)

            if not db_business:
                raise HTTPException(
                    status_code=404,
                    detail=f"Бизнес с id {business.business_id} не найден",
                )

            if db_business.business_type != BusinessType.VIRTUAL:
                raise HTTPException(
                    status_code=400,
                    detail=f"Бизнес с id {business.business_id} не является виртуальным",
                )

            virtual_businesses_settings.append(
                VirtualBusinessSettingsCreateSchema(
                    **business.model_dump(),
                )
            )

        try:
            updated_businesses = await self.virtual_business_manager.create_or_update(virtual_businesses_settings)
        except sqlalchemy.exc.IntegrityError as e:
            log.error(f"Integrity error while creating businesses: {e}")
            raise HTTPException(
                status_code=400,
                detail="Business creation failed due to database constraints",
            )
        except Exception as e:
            log.error(f"Unexpected error while creating businesses: {e}")
            raise HTTPException(
                status_code=500,
                detail="Internal server error occurred",
            )

        return updated_businesses


async def get_business_service(
    db: AsyncSession = Depends(get_session),
) -> BusinessService:
    """
    Dependency injection function that provides an instance of BusinessService with a database session.
    """
    return BusinessService(db=db)
