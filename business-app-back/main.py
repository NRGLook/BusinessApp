from fastapi import FastAPI

from src.api.routes.businesses.view import business_router

app = FastAPI()
app.include_router(business_router)

@app.get("/home")
async def home_page(username: str):
    return f"Dima I need to write dimploma right now {username}"
