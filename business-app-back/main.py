from fastapi import FastAPI

from starlette.middleware.cors import CORSMiddleware

from src.api.routes.home.views import home_router
from src.api.routes.users.views import user_router
from src.api.routes.businesses.view import business_router

# from src.api.routes.education.course.views import course_router
from src.api.routes.education.lesson.views import lessons_router
# from src.api.routes.education.user_course_progress.views import progress_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(business_router)
app.include_router(home_router)
app.include_router(user_router)
# app.include_router(course_router)
# app.include_router(progress_router)
app.include_router(lessons_router)
