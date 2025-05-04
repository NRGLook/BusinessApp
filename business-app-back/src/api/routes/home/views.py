from typing import Optional, Annotated

from fastapi import (
    APIRouter,
    Depends,
)

from src.api.routes.auth.fastapi_users_auth_router import current_active_user
from src.models.dbo.database_models import User

home_router = APIRouter(
    prefix="/home",
    tags=["Home Page"],
)


@home_router.get("/")
async def home_page(
    user: Annotated[
        User,
        Depends(current_active_user),
    ],
    username: Optional[str],
):
    return f"Hello {username}. It's your homepage."
