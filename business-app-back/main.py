from fastapi import FastAPI

from starlette.middleware.cors import CORSMiddleware

from src.api.routes.businesses.view import business_router
from src.api.routes.home.views import home_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все origins (для разработки)
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы
    allow_headers=["*"],  # Разрешаем все заголовки
)

app.include_router(business_router)
app.include_router(home_router)
