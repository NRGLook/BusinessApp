from fastapi_users.authentication import BearerTransport

from src.utils.constants import TOKEN_URL

bearer_transport = BearerTransport(
    tokenUrl=TOKEN_URL,
)
