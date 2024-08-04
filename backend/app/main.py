from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware  
from .middleware.auth import verify_token
from app.database import async_engine
from app import models
from app.routers import users, auth
from app.config.firebase_admin import initialize_firebase

import asyncio

async def init_models():
    async with async_engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    initialize_firebase()
    await init_models()

app.include_router(users.router)
app.include_router(auth.router, prefix="/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Qualitative Research Analysis Tool API"}

@app.get("/protected")
async def protected_endpoint(current_user: dict = Depends(verify_token)):
    return {"message": "Protected endpoint", "user": current_user}
