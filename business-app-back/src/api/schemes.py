from datetime import datetime
from enum import Enum
from typing import Any, Dict, Generic, List, Optional, TypeVar
from uuid import UUID

from fastapi import Query
from pydantic import BaseModel, Field

T = TypeVar("T")


class BaseResponse(BaseModel):
    """
    All responses must be inherited from this class,
    except ErrorResponse
    """

    code: str = "200"
    message: str = "Response"


class ErrorResponse(BaseResponse):
    code: str = "400"
    message: str = "Response Error"


class Response200Schema(BaseResponse):
    code: str = "200"
    message: str = Field(
        default="Success: The request has been successfully processed and the response contains the requested data.",
        examples=['{"code": "200", "message": "Success: Data retrieved successfully.",}'],
    )


class Response400Schema(ErrorResponse):
    code: str = "400"
    message: str = Field(
        default="Bad Request: The server could not understand the request due to invalid syntax.",
        examples=[
            '{"code": "400", "message": "Bad Request: Missing required parameters.",}',
            '{"code": "400", "message": "Bad Request: Invalid data format.",}',
        ],
    )
    details: list | None = Field(default=None)


class Response401Schema(ErrorResponse):
    code: str = "401"
    message: str = Field(
        default="Unauthorized: The request requires user authentication or the provided authentication is invalid.",
        examples=[
            '{"code": "401", "message": "Unauthorized: Invalid or expired token.",}',
            '{"code": "401", "message": "Unauthorized: No authentication credentials provided.",}',
        ],
    )


class Response403Schema(ErrorResponse):
    code: str = "403"
    message: str = Field(
        default="Forbidden: The server understood the request, but it refuses to authorize it.",
        examples=['{"code": "403", "message": "Forbidden: You do not have permission to access this resource.",}'],
    )


class Response404Schema(ErrorResponse):
    code: str = "404"
    message: str = Field(
        default="Not Found: The requested resource could not be found on the server.",
        examples=[
            '{"code": "404", "message": "Not Found: The requested user does not exist.",}',
            '{"code": "404", "message": "Not Found: Resource with the specified ID not found.",}',
        ],
    )


class Response413Schema(ErrorResponse):
    code: str = "413"
    message: str = Field(
        default="Payload Too Large: The request is larger than the server is willing or able to process.",
        examples=[
            '{"code": "413", "message": "Payload Too Large: The uploaded file exceeds the maximum allowed size.",}'
        ],
    )


class Response422Schema(ErrorResponse):
    code: str = "422"
    message: str = Field(
        default="Unprocessable Entity: The server understands the content type of the request entity, but was unable "
        "to process the contained instructions.",
        examples=['{"code": "422", "message": "Unprocessable Entity: The provided data is invalid.",}'],
    )


class Response429Schema(ErrorResponse):
    code: str = "429"
    message: str = Field(
        default="Too Many Requests: The user has sent too many requests in a given amount of time.",
        examples=['{"code": "429", "message": "Too Many Requests: Rate limit exceeded.",}'],
    )


class Response500Schema(ErrorResponse):
    code: str = "500"
    message: str = Field(
        default="Internal Server Error: The server encountered an unexpected condition that prevented it from "
        "fulfilling the request.",
        examples=['{"code": "500", "message": "Internal Server Error: Unexpected error occurred.",}'],
    )


class DebugResponse500Schema(ErrorResponse):
    code: str = "500"
    message: str
    trace: list


class Response503Schema(ErrorResponse):
    code: str = "503"
    message: str = Field(
        default="Service Unavailable: The server is currently unable to handle the request due to temporary "
        "overloading or maintenance of the server.",
        examples=['{"code": "503", "message": "Service Unavailable: The server is under maintenance.",}'],
    )


class PaginationSchema(BaseModel):
    """
    Pagination data schema

    Attributes:
        total_items (int): total number of elements
        page (int): current page
        items_per_page (int): number of items per page
        next_page (int | None): number of the next page
        prev_page (int | None): number of the previous page
        total_pages (int): number of total pages
    """

    total_items: int = Field(
        ...,
        description="Total number of elements (must be positive)",
    )
    page: int = Field(
        ...,
        description="Current page (must be at least 1)",
    )
    items_per_page: int = Field(
        ...,
        description="Number of items per page (must be positive)",
    )
    next_page: int | None = Field(
        None,
        description="Number of the next page (can be None)",
    )
    prev_page: int | None = Field(
        None,
        description="Number of the previous page (can be None)",
    )
    total_pages: int = Field(
        ...,
        description="Number of total pages (must be positive)",
    )


class PaginationParams(BaseModel):
    page: int
    per_page: int


class SortOrderOptions(str, Enum):
    asc = "asc"
    desc = "desc"


class BaseSortOptions(str, Enum):
    @classmethod
    def default(cls) -> str:
        return next(iter(cls))


class NamedSortOptions(BaseSortOptions):
    name = "name"
    id = "id"


class SortParams(BaseModel):
    """
    Class for storing sorting parameters

    Attributes:
        sort_by (List[str]): The fields by which the sorting
            is performed
        order_by (List[SortOrderOptions]): Sort orders corresponding to fields (asc or desc)
    """

    sort_by: Optional[List[str]] = Field(
        None,
        description="The fields by which the sorting is performed",
    )
    order_by: Optional[List[str]] = Field(
        None,
        description="Sort orders corresponding to fields (asc or desc)",
    )


class OrderParams(BaseModel):
    order_by: Optional[List[str]] = Field(
        Query(
            None,
            description="Order by entity fields",
        )
    )


class DataResponseSchema(Response200Schema, Generic[T]):
    data: T


class ListDataResponseSchema(Response200Schema, Generic[T]):
    data: List[T]
    pagination: PaginationSchema | None = None

    @classmethod
    def create(
        cls,
        list_data: List[Dict[str, Any]],
        pagination: PaginationParams | None = None,
        total: int | None = None,
        message: str = "Success",
        additional_data: dict | None = None,
    ):
        from src.utils.helpers import get_pagination_info

        if not additional_data:
            additional_data = dict()

        if pagination is None and total is None:
            return cls(
                data=list_data,
                message=message,
            )

        return cls(
            data=list_data,
            pagination=get_pagination_info(pagination, total),
            message=message,
        )


class NamedEntitySchema(BaseModel):
    id: Optional[UUID] = None
    name: Optional[str] = None


class IDSchema(BaseModel):
    id: Optional[UUID] = None


class PositionBaseFilters(BaseModel):
    position_id: Optional[UUID] = Query(
        None,
        description="Filter by position id",
    )
    position_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by position id list",
        )
    )


class ProjectBaseFilters(BaseModel):
    project_id: Optional[UUID] = Query(
        None,
        description="Filter by project id",
    )
    project_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by project id list",
        )
    )


class QueueBaseFilters(BaseModel):
    queue_id: Optional[UUID] = Query(
        None,
        description="Filter by queue id",
    )
    queue_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by queue id list",
        )
    )


class ConstructionObjectBaseFilters(BaseModel):
    construction_object_id: Optional[UUID] = Query(
        None,
        description="Filter by construction_object id",
    )
    construction_object_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by construction_object id",
        )
    )


class HousingBaseFilters(BaseModel):
    housing_id: Optional[UUID] = Query(
        None,
        description="Filter by housing id",
    )
    housing_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by housing id",
        )
    )


class MontgBlockBaseFilters(BaseModel):
    montg_block_id: Optional[UUID] = Query(
        None,
        description="Filter by montg_block id",
    )
    montg_block_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by montg_block id list",
        )
    )


class SectionBaseFilters(BaseModel):
    section_id: Optional[UUID] = Query(
        None,
        description="Filter by section id",
    )
    section_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by section id list",
        )
    )


class FloorBaseFilters(BaseModel):
    floor_id: Optional[UUID] = Query(
        None,
        description="Filter by floor id",
    )
    floor_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by floor id list",
        )
    )


class WorkSetBaseFilters(BaseModel):
    work_set_id: Optional[UUID] = Query(
        None,
        description="Filter by work_set id",
    )
    work_set_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by work_set id list",
        )
    )


class WorkGroupBaseFilters(BaseModel):
    work_group_id: Optional[UUID] = Query(
        None,
        description="Filter by work_group id",
    )
    work_group_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by work_group id list",
        )
    )


class WorkTypeBaseFilters(BaseModel):
    work_type_id: Optional[UUID] = Query(
        None,
        description="Filter by work_type id",
    )
    work_type_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by work_type id list",
        )
    )


class WorkBaseFilters(BaseModel):
    work_id: Optional[UUID] = Query(
        None,
        description="Filter by work id",
    )
    work_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by work id list",
        )
    )


class ContractorBaseFilters(BaseModel):
    contractor_id: Optional[UUID] = Query(
        None,
        description="Filter by contractor id",
    )
    contractor_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by contractor id list",
        )
    )


class ConstructionBaseFilters(BaseModel):
    construction_id: Optional[UUID] = Query(
        None,
        description="Filter by construction id",
    )
    construction_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by construction id list",
        )
    )


class WorkDateBaseFilters(BaseModel):
    work_date__gte: Optional[datetime] = Query(
        None,
        description="Filter by start date",
    )
    work_date__lte: Optional[datetime] = Query(
        None,
        description="Filter by end date",
    )


class ReasonBaseFilters(BaseModel):
    reason_id: Optional[UUID] = Query(
        None,
        description="Filter by reason id",
    )
    reason_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by position id list",
        )
    )


class WindowOperationBaseFilters(BaseModel):
    window_operation_id: Optional[UUID] = Query(
        None,
        description="Filter by window operation id",
    )
    window_operation_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by window operation id list",
        )
    )


class ActGroupBaseFilters(BaseModel):
    act_group_id: Optional[UUID] = Query(
        None,
        description="Filter by act_group id",
    )
    act_group_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by act_group id list",
        )
    )


class StatusBaseFilters(BaseModel):
    status_id: Optional[UUID] = Query(
        None,
        description="Filter by status id",
    )
    status_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by status id list",
        )
    )


class EstimateBaseFilters(BaseModel):
    estimate_id: Optional[UUID] = Query(
        None,
        description="Filter by estimate id",
    )
    estimate_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by estimate id list",
        )
    )


class LifeCycleStatusBaseFilters(BaseModel):
    lifecycle_status_id: Optional[UUID] = Query(
        None,
        description="Filter by lifecycle_status_id",
    )
    lifecycle_status_id__in: Optional[List[UUID]] = Field(
        Query(
            None,
            description="Filter by lifecycle_status_id list",
        )
    )
