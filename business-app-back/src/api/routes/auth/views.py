from fastapi import (
    APIRouter,
    Depends,
)
from fastapi.security import HTTPBearer

from src.api.dependencies.authentication.backend import authentication_backend
from src.api.routes.auth.fastapi_users_auth_router import fastapi_users
from src.api.routes.users.schemes import (
    UserRead,
    UserCreate,
)

http_bearer = HTTPBearer(auto_error=False)

auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
    dependencies=[Depends(http_bearer)],
)

auth_router.include_router(
    router=fastapi_users.get_auth_router(authentication_backend),
)

auth_router.include_router(
    router=fastapi_users.get_register_router(UserRead, UserCreate),
)
