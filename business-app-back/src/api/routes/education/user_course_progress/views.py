from typing import List

from fastapi import APIRouter, Depends, Query, HTTPException

from src.api.schemes import Response400Schema, Response500Schema
from src.api.routes.education.user_course_progress.schemes import (
    UserCourseProgressRead,
    UserCourseProgressUpdate,
)
from src.services.educations.education import EducationService, get_education_service

progress_router = APIRouter(
    prefix="/education",
    tags=["Progress"],
)


@progress_router.post(
    "/progress",
    responses={
        200: {"model": UserCourseProgressRead, "description": "Progress updated successfully"},
        400: {"model": Response400Schema, "description": "Invalid request"},
        500: {"model": Response500Schema, "description": "Server error occurred"},
    },
    summary="Update user's course progress",
)
async def update_user_progress(
    data: UserCourseProgressUpdate,
    service: EducationService = Depends(get_education_service),
):
    try:
        return await service.update_user_progress(data)
    except Exception:
        raise HTTPException(status_code=500, detail={"detail": "Internal server error", "code": "server_error"})


@progress_router.get(
    "/progress/me",
    responses={
        200: {"model": List[UserCourseProgressRead], "description": "User progress fetched successfully"},
        400: {"model": Response400Schema, "description": "Invalid request"},
        500: {"model": Response500Schema, "description": "Server error occurred"},
    },
    summary="Retrieve current user course progress",
)
async def get_user_progress(
    user_id: int = Query(..., description="User ID"),
    service: EducationService = Depends(get_education_service),
):
    try:
        return await service.get_user_progress(user_id)
    except Exception:
        raise HTTPException(status_code=500, detail={"detail": "Internal server error", "code": "server_error"})
