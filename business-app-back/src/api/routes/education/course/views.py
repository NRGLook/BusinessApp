from uuid import UUID
from typing import Optional, Annotated

import sqlalchemy.exc

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.api.routes.auth.fastapi_users_auth_router import (
    current_active_super_user,
    current_active_user,
)
from src.api.schemes import (
    Response500Schema,
    PaginationParams,
    OrderParams,
    Response400Schema,
    Response404Schema,
)
from src.api.routes.education.course.schemes import (
    CourseCreateBatchSchema,
    CourseReadSchema,
    CourseDeleteBatchSchema,
)
from src.models.dbo.database_models import User
from src.services.courses.course import CourseService, get_course_service
from src.utils.helpers import pagination_params

course_router = APIRouter(
    prefix="/education/courses",
    tags=["Courses"],
)


@course_router.get(
    "",
    responses={
        200: {
            "model": CourseReadSchema,
            "description": "Course found successfully",
        },
        404: {
            "model": Response404Schema,
            "description": "Course not found",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve course by ID",
)
async def get_courses(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    course_id: Optional[UUID] = Query(None, description="ID of the course"),
    search: Optional[str] = Query(None, description="Search by course title"),
    pagination: PaginationParams = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: CourseService = Depends(get_course_service),
):
    try:
        course = await service.get_courses(
            course_id=course_id,
            search=search,
            pagination=pagination,
            order_by=order_by.model_dump()["order_by"],
        )
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return course
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "detail": "Internal server error",
                "code": "server_error",
            },
        )


@course_router.post(
    "",
    responses={
        201: {
            "model": CourseCreateBatchSchema,
            "description": "Course created/updated successfully",
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
    summary="Create or update courses based on provided data",
)
async def create_or_update_courses(
    user: Annotated[
        User,
        Depends(current_active_super_user),
    ],
    courses: CourseCreateBatchSchema,
    service: CourseService = Depends(get_course_service),
):
    try:
        return await service.create_or_update_courses(courses.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found.",
        )


@course_router.delete(
    "",
    responses={
        200: {
            "model": CourseDeleteBatchSchema,
            "description": "Course deleted successfully",
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
    summary="Delete courses by ID list",
)
async def delete_courses(
    user: Annotated[
        User,
        Depends(current_active_super_user),
    ],
    courses: CourseDeleteBatchSchema,
    service: CourseService = Depends(get_course_service),
):
    try:
        return await service.delete_courses(courses.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found.",
        )
