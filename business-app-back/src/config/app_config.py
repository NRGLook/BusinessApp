from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

from src.config.settings import SettingsProvider


middleware = [Middleware(CORSMiddleware, allow_methods=["*"], allow_origins=["*"], allow_headers=["*"])]

settings = SettingsProvider.get()

api_version = settings.API_VERSION
