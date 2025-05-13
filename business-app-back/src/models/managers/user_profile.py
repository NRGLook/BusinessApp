from src.services.logger import LoggerProvider
from src.models.dbo.database_models import UserProfile

from .common import BaseManager

log = LoggerProvider().get_logger(__name__)


class UserProfileManager(BaseManager):
    entity = UserProfile
