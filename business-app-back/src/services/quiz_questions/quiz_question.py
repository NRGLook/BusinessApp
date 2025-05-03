from uuid import UUID
from typing import Optional

import sqlalchemy.exc
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import Depends, HTTPException

import src.models.managers as managers
from src.api.schemes import PaginationParams
from src.api.routes.education.quiz.schemes import (
    QuizQuestionReadSchema,
    QuizQuestionListResponseSchema,
    QuizQuestionCreateSchema,
    QuizQuestionDeleteSchema,
)
from src.config.database_config import get_session
from src.services.common import BaseService
from src.services.logger import LoggerProvider

log = LoggerProvider().get_logger(__name__)


class QuizQuestionService(BaseService):
    """
    Service layer for managing quiz questions.
    Encapsulates all business logic related to fetching, creating/updating, and deleting quiz questions.
    """

    def __init__(self, db: AsyncSession):
        self.quiz_manager = managers.QuizQuestionManager(db)

    async def get_questions(
        self,
        question_id: Optional[UUID],
        lesson_id: Optional[UUID],
        search: Optional[str],
        order_by: list[str],
        pagination: PaginationParams,
        **filters,
    ):
        """
        Retrieve quiz questions with optional filters like lesson ID, question ID, or text search.

        :param question_id: UUID of the specific question to fetch.
        :param lesson_id: UUID of the lesson to filter questions.
        :param search: Search term to filter by question text (ILIKE).
        :param order_by: List of fields to order the results by.
        :param pagination: Pagination parameters (limit/offset).
        :return: Paginated list of matching quiz questions with total count.
        """
        filters["question_text__ilike"] = search
        questions = await self.quiz_manager.search(
            order_by=order_by,
            pagination=pagination,
            id=question_id,
            lesson_id=lesson_id,
            **filters,
        )
        total = await self.quiz_manager.count(
            id=question_id,
            lesson_id=lesson_id,
            **filters,
        )

        mapped = [self.map_obj_to_schema(q, QuizQuestionReadSchema).model_dump() for q in questions]
        return QuizQuestionListResponseSchema.create(list_data=mapped, pagination=pagination, total=total)

    async def create_or_update_questions(
        self,
        questions: list[QuizQuestionCreateSchema],
    ) -> list:
        """
        Create new quiz questions or update existing ones.
        Each question must be complete (lesson_id, question_text, choices, correct_answer).

        :param questions: List of questions to create or update.
        :return: List of saved question objects.
        """
        try:
            data = [QuizQuestionCreateSchema(**q.model_dump()) for q in questions]
            return await self.quiz_manager.create_or_update(data)
        except sqlalchemy.exc.IntegrityError as e:
            log.error(f"Integrity error during create/update: {e}")
            raise HTTPException(status_code=400, detail=str(e))

    async def delete_questions(
        self,
        questions: list[QuizQuestionDeleteSchema],
    ) -> None:
        """
        Delete quiz questions based on their IDs.

        :param questions: List of QuizQuestionDeleteSchema, each containing an ID.
        """
        try:
            for q in questions:
                if q.id:
                    await self.quiz_manager.delete_by_id(q.id)
        except sqlalchemy.exc.IntegrityError as e:
            log.error(f"Error deleting quiz question: {e}")
            raise HTTPException(status_code=400, detail=str(e))


async def get_quiz_question_service(
    db: AsyncSession = Depends(get_session),
) -> QuizQuestionService:
    """
    Dependency provider for injecting QuizQuestionService into FastAPI endpoints.

    :param db: Async database session.
    :return: An instance of QuizQuestionService with the session attached.
    """
    return QuizQuestionService(db=db)
