from src.services.logger import LoggerProvider
from src.models.dbo.database_models import VirtualBusinessSettings

from .common import BaseManager

log = LoggerProvider().get_logger(__name__)


class VirtualBusinessManager(BaseManager):
    entity = VirtualBusinessSettings
