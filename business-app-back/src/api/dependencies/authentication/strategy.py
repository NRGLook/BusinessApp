from typing import (
    Annotated,
    TYPE_CHECKING,
)

from fastapi import Depends
from fastapi_users.authentication.strategy.db import (
    DatabaseStrategy,
)

from src.api.dependencies.authentication.access_token import get_access_tokens_db
from src.utils.constants import LIFETIME_SECONDS

if TYPE_CHECKING:
    from src.models.dbo.database_models import AccessToken
    from fastapi_users.authentication.strategy.db import AccessTokenDatabase


def get_database_strategy(
    access_tokens_db: Annotated[
        "AccessTokenDatabase[AccessToken]",
        Depends(get_access_tokens_db),
    ],
) -> DatabaseStrategy:
    return DatabaseStrategy(
        database=access_tokens_db,
        lifetime_seconds=LIFETIME_SECONDS,
    )
