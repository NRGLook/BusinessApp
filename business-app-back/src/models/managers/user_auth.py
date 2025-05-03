from uuid import UUID
from typing import (
    Optional,
    TYPE_CHECKING,
)

from fastapi_users import BaseUserManager, UUIDIDMixin

from src.config.app_config import settings
from src.models.dbo.database_models import User
from src.services.logger import LoggerProvider

if TYPE_CHECKING:
    from fastapi import Request

log = LoggerProvider().get_logger(__name__)


class UserAuthManager(UUIDIDMixin, BaseUserManager[User, UUID]):
    reset_password_token_secret = settings.RESET_PASSWORD_TOKEN_SECRET
    verification_token_secret = settings.RESET_PASSWORD_TOKEN_SECRET

    async def on_after_register(
        self,
        user: User,
        request: Optional["Request"] = None,
    ):
        log.info(
            "User %r has registered.",
            user.id,
        )

    async def on_after_forgot_password(
        self,
        user: User,
        token: str,
        request: Optional["Request"] = None,
    ):
        log.info(
            "User %r has forgot their password. Reset token: %r",
            user.id,
            token,
        )

    async def on_after_request_verify(
        self,
        user: User,
        token: str,
        request: Optional["Request"] = None,
    ):
        log.info(
            "Verification requested for user %r. Verification token: %r",
            user.id,
            token,
        )
