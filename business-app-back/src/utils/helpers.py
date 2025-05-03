import math
from datetime import datetime, timezone
from uuid import UUID
from typing import (
    Optional,
    Type,
    Any,
    List,
)

from fastapi import (
    HTTPException,
    Query,
)

from sqlalchemy import (
    desc,
    asc,
    Column,
)
from sqlalchemy.orm import aliased

from src.api.schemes import (
    BaseSortOptions,
    PaginationParams,
    SortParams,
)
from src.utils.constants import DATETIME_FORMAT


def split_into_batches(
    data: List[Any],
    batch_size: int | None,
) -> List[List[Any]]:
    """
    Splits data into batches of the specified size.

    :param data: List of data.
    :param batch_size: Size of one batch.
    :return: List of batches.
    """
    if batch_size is None or batch_size <= 0:
        batch_size = len(data) or 1
    return [data[i : i + batch_size] for i in range(0, len(data), batch_size)]


def get_paginated_query(query: Query, pagination: PaginationParams):
    """
    Applies pagination to the provided SQLAlchemy query.

    Args:
        query (SQLAlchemyQuery): The SQLAlchemy query object to paginate.
        pagination (PaginationParams): The pagination parameters.

    Returns:
        SQLAlchemyQuery: The paginated SQLAlchemy query.
    """
    return query.limit(pagination.per_page).offset((pagination.page - 1) * pagination.per_page)


def get_pagination_info(pagination: PaginationParams | None, total: int | None) -> dict[str, int | bool | None]:
    """
    Generates pagination info based on the current page, items per page, and total items.

    Args:
        pagination (PaginationParams): The pagination parameters.
        total (int): The total number of items.

    Returns:
        dict[str, int | bool | None]: A dictionary containing pagination info.
    """
    if pagination is None or total is None:
        return {
            "total_items": total,
            "page": None,
            "items_per_page": None,
            "next_page": None,
            "prev_page": None,
            "total_pages": None,
        }
    is_last_page = pagination.page * pagination.per_page >= total
    total_pages = math.ceil(total / pagination.per_page) if pagination.per_page else 0
    return {
        "total_items": total,
        "page": pagination.page,
        "items_per_page": pagination.per_page,
        "next_page": pagination.page + 1 if not is_last_page else None,
        "prev_page": pagination.page - 1 if pagination.page > 1 else None,
        "total_pages": total_pages,
    }


def apply_sorting(query: Query, sort_params: SortParams, model: Type) -> Query:
    """
    Applies a collation to the SQLAlchemy-supplied query based on the collation data.

    Args:
        query (SQLAlchemyQuery): SQLAlchemy query object to sort by.
        sort_params (SortParams): Sorting options.
        model (Type): The model class that matches the query.

    Returns:
        SQLAlchemyQuery: Sorted SQLAlchemy query.

    Raises:
        HTTPException: If the sort field is invalid or the number of fields and orders does not match.
    """
    if not sort_params.sort_by or not sort_params.order_by:
        return query

    if len(sort_params.sort_by) != len(sort_params.order_by):
        raise HTTPException(status_code=400, detail="The number of sort fields and orders does not match.")

    for sort_by, order in zip(sort_params.sort_by, sort_params.order_by):
        if order not in ["asc", "desc"]:
            raise HTTPException(status_code=400, detail=f"Invalid sort order: {order}")

        sort_order = desc if order == "desc" else asc

        relation_chain = sort_by.split(".")

        if len(relation_chain) == 1:
            field = relation_chain[0]
            try:
                query = query.order_by(sort_order(getattr(model, field)))
            except AttributeError:
                raise HTTPException(status_code=400, detail=f"Invalid sort field: {field}")

        else:
            current_model = model
            current_alias = None

            for idx, relation in enumerate(relation_chain):
                is_last = idx == len(relation_chain) - 1

                if is_last:
                    try:
                        query = query.order_by(sort_order(getattr(current_alias or current_model, relation)))
                    except AttributeError:
                        raise HTTPException(status_code=400, detail=f"Invalid sort field: {relation}")
                else:
                    try:
                        related_model = getattr(current_model, relation).property.mapper.class_
                    except AttributeError:
                        raise HTTPException(status_code=400, detail=f"Invalid relation or model: {relation}")

                    related_alias = aliased(related_model)
                    query = query.join(related_alias, getattr(current_model, relation), isouter=True)

                    current_model = related_model
                    current_alias = related_alias

    return query


async def filter_query(query: Query, model: Type, filters: Optional[dict[str, Any]] = None) -> Query:
    """
    Applies filters to the provided SQLAlchemy query based on the given filter parameters.

    Args:
        query (SQLAlchemyQuery): The SQLAlchemy query object to filter.
        model (Type): The model class corresponding to the query.
        filters (Optional[dict[str, Any]]): A dictionary of filters to apply.

    Returns:
        SQLAlchemyQuery: The filtered SQLAlchemy query.
    """
    if filters is None:
        return query

    for field, value in filters.items():
        if value is not None:
            column: Column = getattr(model, field)
            if isinstance(value, str) and "%" in value:
                query = query.where(column.ilike(value))
            else:
                query = query.where(column == value)

    return query


def pagination_params(
    page: int = Query(1, ge=1, description="Page number (must be 1 or greater)"),
    per_page: int = Query(100, ge=1, description="Number of items per page (must be 1 or greater)"),
) -> PaginationParams:
    """
    Validates and creates pagination parameters.

    Args:
        page (int): The page number, must be 1 or greater.
        per_page (int): The number of items per page, must be 1 or greater.

    Returns:
        PaginationParams: The validated pagination parameters.

    Raises:
        HTTPException: If page or per_page is less than 1.
    """
    if page < 1 or per_page < 1:
        raise HTTPException(status_code=400, detail="Page number and per_page must be greater than 0")
    return PaginationParams(page=page, per_page=per_page)


def sorting_params(sort_options: BaseSortOptions):
    """
    Creates sorting parameters with default values.

    Args:
        sort_options (BaseSortOptions): The base sort options class.

    Returns:
        Callable: A function that returns SortParams based on the query parameters.
    """

    def params_func(
        sort_by: Optional[List[str]] = Query(None, description="Sort by fields"),
        order_by: Optional[List[str]] = Query(None, description="Sort order for each field"),
    ) -> SortParams:
        return SortParams(sort_by=sort_by, order_by=order_by)

    return params_func


def convert_datetime_with_z_suffix(dt: datetime) -> str:
    return dt.strftime(DATETIME_FORMAT)


def transform_to_utc_datetime(dt: datetime) -> datetime:
    return dt.astimezone(tz=timezone.utc)


def convert_uuids_and_dates_to_strings(data):
    if isinstance(data, dict):
        return {key: convert_uuids_and_dates_to_strings(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_uuids_and_dates_to_strings(item) for item in data]
    elif isinstance(data, UUID):
        return str(data)
    elif isinstance(data, datetime):
        return data.isoformat()
    return data


def json_serializer(obj):
    if isinstance(obj, UUID):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")
