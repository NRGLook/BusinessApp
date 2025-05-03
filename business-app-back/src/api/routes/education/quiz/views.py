from uuid import UUID
from typing import Optional

import sqlalchemy.exc

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.api.schemes import Response500Schema, PaginationParams, OrderParams, Response400Schema, Response404Schema
from src.api.routes.education.quiz.schemes import (
    QuizQuestionCreateBatchSchema,
    QuizQuestionReadSchema,
    QuizQuestionDeleteBatchSchema,
)
from src.services.quiz_questions.quiz_question import QuizQuestionService, get_quiz_question_service
from src.utils.helpers import pagination_params

quiz_router = APIRouter(
    prefix="/education/quiz-questions",
    tags=["Quiz Questions"],
)


@quiz_router.get(
    "",
    responses={
        200: {
            "model": QuizQuestionReadSchema,
            "description": "Quiz question(s) retrieved successfully",
        },
        404: {
            "model": Response404Schema,
            "description": "Quiz question not found",
        },
        500: {
            "model": Response500Schema,
            "description": "Server error occurred",
        },
    },
    summary="Retrieve quiz questions",
)
async def get_quiz_questions(
    question_id: Optional[UUID] = Query(None, description="ID of the quiz question"),
    lesson_id: Optional[UUID] = Query(None, description="Lesson ID for filtering"),
    search: Optional[str] = Query(None, description="Search by question text"),
    pagination: PaginationParams = Depends(pagination_params),
    order_by: OrderParams = Depends(),
    service: QuizQuestionService = Depends(get_quiz_question_service),
):
    try:
        result = await service.get_questions(
            question_id=question_id,
            lesson_id=lesson_id,
            search=search,
            pagination=pagination,
            order_by=order_by.model_dump()["order_by"],
        )
        if not result:
            raise HTTPException(status_code=404, detail="Quiz question not found")
        return result
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"detail": "Internal server error", "code": "server_error"},
        )


@quiz_router.post(
    "",
    responses={
        201: {
            "model": QuizQuestionCreateBatchSchema,
            "description": "Quiz questions created/updated successfully",
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
    summary="Create or update quiz questions",
)
async def create_or_update_quiz_questions(
    questions: QuizQuestionCreateBatchSchema,
    service: QuizQuestionService = Depends(get_quiz_question_service),
):
    try:
        return await service.create_or_update_questions(questions.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found.",
        )


@quiz_router.delete(
    "",
    responses={
        200: {
            "model": QuizQuestionDeleteBatchSchema,
            "description": "Quiz question(s) deleted successfully",
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
    summary="Delete quiz questions",
)
async def delete_quiz_questions(
    questions: QuizQuestionDeleteBatchSchema,
    service: QuizQuestionService = Depends(get_quiz_question_service),
):
    try:
        return await service.delete_questions(questions.data)
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource not found.",
        )
