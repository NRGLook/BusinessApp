from typing import (
    Annotated,
    TYPE_CHECKING,
)

from fastapi import Depends

from src.config.database_config import get_async_session
from src.models.dbo.database_models import User

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession


async def get_users_db(
    session: Annotated[
        "AsyncSession",
        Depends(get_async_session),
    ],
):
    yield User.get_db(session=session)
