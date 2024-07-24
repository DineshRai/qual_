from fastapi import FastAPI
from app.database import engine
from app import models
from app.routers import users

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the Qualitative Research Analysis Tool API"}
