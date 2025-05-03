from fastapi_users.authentication import AuthenticationBackend

from src.api.dependencies.authentication.strategy import get_database_strategy
from src.config.authentication.transport import bearer_transport

authentication_backend = AuthenticationBackend(
    name="access-tokens-db",
    transport=bearer_transport,
    get_strategy=get_database_strategy,
)
