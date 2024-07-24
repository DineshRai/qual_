from fastapi import FastAPI, Depends
from .middleware.auth import verify_token
from app.database import engine
from app import models
from app.routers import users

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the Qualitative Research Analysis Tool API"}

  
# sample protected endpoint
@app.get("/protected")
async def protected_endpoint(current_user: dict = Depends(verify_token)):
    return {"message": "Protected endpoint", "user": current_user}