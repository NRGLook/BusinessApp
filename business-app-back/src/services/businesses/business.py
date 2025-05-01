from typing import Optional
from uuid import UUID

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

import src.models.managers as managers
from src.api.routes.businesses.schemes import BusinessListResponseSchema, BusinessSchema
from src.api.schemes import PaginationParams, NamedEntitySchema
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class BusinessService(BaseService):
    def __init__(self, db: AsyncSession):
        self.business_manager = managers.BusinessManager(db)

        self.base_fields = {
            "act_group": NamedEntitySchema,
        }

    async def get_businesses(self, search: Optional[str], order_by: list[str], pagination: PaginationParams, **filters):
        filters["name__ilike"] = search
        work_sets: list = await self.business_manager.search(
            order_by=order_by, pagination=pagination, with_scalars=False, **filters
        )
        total = await self.business_manager.count(**filters)

        work_sets_mapped = [self.map_obj_to_schema(work_set, BusinessSchema).model_dump() for work_set in work_sets]

        return BusinessListResponseSchema.create(list_data=work_sets_mapped, pagination=pagination, total=total)


async def get_business_service(
    db: AsyncSession = Depends(get_session),
) -> BusinessService:
    return BusinessService(db=db)
