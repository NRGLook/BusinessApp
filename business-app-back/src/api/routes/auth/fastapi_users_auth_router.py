from uuid import UUID

from fastapi_users import FastAPIUsers

from src.api.dependencies.authentication.backend import authentication_backend
from src.api.dependencies.authentication.user_auth import get_user_manager
from src.models.dbo.database_models import User


fastapi_users = FastAPIUsers[User, UUID](
    get_user_manager,
    [authentication_backend],
)

current_active_user = fastapi_users.current_user(active=True)
current_active_super_user = fastapi_users.current_user(active=True, superuser=True)
