from uuid import UUID
from typing import Optional, List

import sqlalchemy
from fastapi import Depends, HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

import src.models.managers as managers
from src.api.schemes import PaginationParams
from src.api.routes.businesses.schemes import (
    BusinessSchema,
    BusinessListResponseSchema,
    BusinessCreate,
    BusinessCreateWithUser,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class BusinessService(BaseService):
    def __init__(self, db: AsyncSession):
        self.business_manager = managers.BusinessManager(db)

    async def get_businesses(
        self,
        business_type: Optional[str],
        search: Optional[str],
        order_by: list[str],
        pagination: PaginationParams,
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
            **filters,
        )
        total = await self.business_manager.count(**filters)
        businesses_mapped = [self.map_obj_to_schema(business, BusinessSchema).model_dump() for business in businesses]

        return BusinessListResponseSchema.create(
            list_data=businesses_mapped,
            pagination=pagination,
            total=total,
        )

    async def create_or_update_business(
        self,
        businesses: List[BusinessCreate],
        user_id: UUID,
    ):
        businesses_with_user = []
        for business in businesses:
            businesses_with_user.append(
                BusinessCreateWithUser(
                    **business.model_dump(),
                    user_id=user_id,
                    current_value=business.initial_investment,
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


async def get_business_service(
    db: AsyncSession = Depends(get_session),
) -> BusinessService:
    """
    Dependency injection function that provides an instance of BusinessService with a database session.
    """
    return BusinessService(db=db)
