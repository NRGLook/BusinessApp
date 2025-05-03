from typing import Optional

from fastapi import APIRouter


home_router = APIRouter(
    prefix="/home",
    tags=["Home Page"],
)


@home_router.get("/")
async def home_page(
    username: Optional[str],
):
    return f"Hello {username}. It's your homepage."
