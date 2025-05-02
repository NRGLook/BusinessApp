# from typing import Optional, List
#
# from fastapi import APIRouter, Depends, Query, HTTPException
#
# from src.api.routes.education.category.schemes import CourseCategoryRead
# from src.api.schemes import (
#     OrderParams,
#     Response400Schema,
#     Response500Schema,
#     PaginationParams,
# )
# from src.utils.helpers import pagination_params
# from src.api.routes.education.course.schemes import (
#     CourseListResponseSchema,
#     CourseRead,
#     CourseCreate,
#     CourseUpdate,
# )
# from src.services.educations.education import EducationService, get_education_service
#
# course_router = APIRouter(
#     prefix="/education",
#     tags=["Courses"],
# )
#
#
# @course_router.get(
#     "/courses",
#     responses={
#         200: {
#             "model": CourseListResponseSchema,
#             "description": "Courses found successfully",
#         },
#         400: {
#             "model": Response400Schema,
#             "description": "Invalid request",
#         },
#         500: {
#             "model": Response500Schema,
#             "description": "Server error occurred",
#         },
#     },
#     summary="Retrieve courses with filtering and pagination",
# )
# async def get_courses(
#     search: Optional[str] = Query(
#         None,
#         description="Search by course title",
#     ),
#     category_id: Optional[int] = Query(
#         None,
#         description="Filter by category ID",
#     ),
#     pagination: PaginationParams = Depends(pagination_params),
#     order_by: OrderParams = Depends(),
#     service: EducationService = Depends(get_education_service),
# ):
#     try:
#         return await service.get_courses(
#             category_id=category_id,
#             search=search,
#             pagination=pagination,
#             order_by=order_by.model_dump()["order_by"],
#         )
#     except ValueError as e:
#         raise HTTPException(
#             status_code=400,
#             detail={
#                 "detail": str(e),
#                 "code": "validation_error",
#             },
#         )
#     except Exception:
#         raise HTTPException(
#             status_code=500,
#             detail={
#                 "detail": "Internal server error",
#                 "code": "server_error",
#             },
#         )
#
#
# @course_router.get(
#     "/courses/{course_id}",
#     responses={
#         200: {
#             "model": CourseRead,
#             "description": "Course retrieved successfully",
#         },
#         404: {
#             "description": "Course not found",
#         },
#         500: {
#             "model": Response500Schema,
#             "description": "Server error occurred",
#         },
#     },
#     summary="Retrieve course by ID",
# )
# async def get_course(
#     course_id: int,
#     service: EducationService = Depends(get_education_service),
# ):
#     try:
#         course = await service.get_course_by_id(course_id)
#         if not course:
#             raise HTTPException(
#                 status_code=404,
#                 detail="Course not found",
#             )
#         return course
#     except Exception:
#         raise HTTPException(
#             status_code=500,
#             detail={
#                 "detail": "Internal server error",
#                 "code": "server_error",
#             },
#         )
#
#
# @course_router.post(
#     "/courses",
#     responses={
#         200: {
#             "model": CourseRead,
#             "description": "Course created successfully",
#         },
#         400: {
#             "model": Response400Schema,
#             "description": "Invalid request",
#         },
#         500: {
#             "model": Response500Schema,
#             "description": "Server error occurred",
#         },
#     },
#     summary="Create new course",
# )
# async def create_course(
#     data: CourseCreate,
#     service: EducationService = Depends(get_education_service),
# ):
#     try:
#         return await service.create_course(data)
#     except ValueError as e:
#         raise HTTPException(
#             status_code=400,
#             detail={
#                 "detail": str(e),
#                 "code": "validation_error",
#             },
#         )
#     except Exception:
#         raise HTTPException(
#             status_code=500,
#             detail={
#                 "detail": "Internal server error",
#                 "code": "server_error",
#             },
#         )
#
#
# @course_router.put(
#     "/courses/{course_id}",
#     responses={
#         200: {
#             "model": CourseRead,
#             "description": "Course updated successfully",
#         },
#         400: {
#             "model": Response400Schema,
#             "description": "Invalid data",
#         },
#         404: {
#             "description": "Course not found",
#         },
#         500: {
#             "model": Response500Schema,
#             "description": "Server error occurred",
#         },
#     },
#     summary="Update existing course",
# )
# async def update_course(
#     course_id: int,
#     data: CourseUpdate,
#     service: EducationService = Depends(get_education_service),
# ):
#     try:
#         return await service.update_course(course_id, data)
#     except ValueError as e:
#         raise HTTPException(
#             status_code=400,
#             detail={
#                 "detail": str(e),
#                 "code": "validation_error",
#             },
#         )
#     except Exception:
#         raise HTTPException(
#             status_code=500,
#             detail={
#                 "detail": "Internal server error",
#                 "code": "server_error",
#             },
#         )
#
#
# @course_router.get(
#     "/courses/categories",
#     responses={
#         200: {
#             "model": List[CourseCategoryRead],
#             "description": "Categories fetched successfully",
#         },
#         500: {
#             "model": Response500Schema,
#             "description": "Server error occurred",
#         },
#     },
#     summary="Get all course categories",
# )
# async def get_categories(
#     service: EducationService = Depends(get_education_service),
# ):
#     try:
#         return await service.get_categories()
#     except Exception:
#         raise HTTPException(
#             status_code=500,
#             detail={
#                 "detail": "Internal server error",
#                 "code": "server_error",
#             },
#         )
