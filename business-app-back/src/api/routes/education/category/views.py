from uuid import UUID
from typing import Optional

import sqlalchemy.exc

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.api.schemes import (
    Response500Schema,
    PaginationParams,
    OrderParams,
    Response400Schema,
    Response404Schema,
)
from src.api.routes.education.category.schemes import (
    CourseCategoryCreateBatchSchema,
    CourseCategoryReadSchema,
    CourseCategoryDeleteBatchSchema,
)
from src.services.categories.category import (
    CourseCategoryService,
    get_course_category_service,
)
from src.utils.helpers import pagination_params

course_categories_router = APIRouter(
    prefix="/education/course-categories",
    tags=["Course Categories"],
)


@course_categories_router.get(
    "",
    responses={
        200: {
            "model": CourseCategoryReadSchema,
            "description": "Category found successfully",
        },
        404: {
            "model": Response404Schema,
            "description": "Category not found",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve course category by ID",
)
async def get_course_categories(
    category_id: Optional[UUID] = Query(None, description="ID of the category"),
    search: Optional[str] = Query(None, description="Search by category name"),
    pagination: PaginationParams = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: CourseCategoryService = Depends(get_course_category_service),
):
    try:
        category = await service.get_categories(
            category_id=category_id,
            search=search,
            pagination=pagination,
            order_by=order_by.model_dump()["order_by"],
        )
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@course_categories_router.post(
    "",
    responses={
        201: {
            "model": CourseCategoryCreateBatchSchema,
            "description": "Category created/updated successfully",
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
    summary="Create, update course categories",
)
async def create_or_update_course_categories(
    categories: CourseCategoryCreateBatchSchema,
    service: CourseCategoryService = Depends(get_course_category_service),
):
    try:
        return await service.create_or_update_categories(categories.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found.",
        )


@course_categories_router.delete(
    "",
    responses={
        200: {
            "model": CourseCategoryDeleteBatchSchema,
            "description": "Category deleted successfully",
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
    summary="Delete course categories",
)
async def delete_course_categories(
    categories: CourseCategoryDeleteBatchSchema,
    service: CourseCategoryService = Depends(get_course_category_service),
):
    try:
        return await service.delete_categories(categories.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found.",
        )
