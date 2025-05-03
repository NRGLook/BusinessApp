from fastapi import APIRouter

from src.api.dependencies.authentication.backend import authentication_backend
from src.api.routes.auth.fastapi_users_auth_router import fastapi_users

auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

auth_router.include_router(
    router=fastapi_users.get_auth_router(authentication_backend),
)
