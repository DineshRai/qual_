from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware  
from .middleware.auth import verify_token
from app.database import async_engine
from app import models
from app.routers import users, auth, files, projects, analyses, activities
from app.config.firebase_admin import initialize_firebase
from fastapi.routing import APIRoute


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
app.include_router(files.router, prefix="/files", tags=["files"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(analyses.router, prefix="/analyses", tags=["analyses"])
app.include_router(activities.router, prefix="/activities", tags=["activities"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Qualitative Research Analysis Tool API"}

@app.get("/protected")
async def protected_endpoint(current_user: dict = Depends(verify_token)):
    return {"message": "Protected endpoint", "user": current_user}


@app.get("/routes")
def get_routes():
    routes = []
    for route in app.routes:
        if isinstance(route, APIRoute):
            route_info = {
                "path": route.path,
                "name": route.name,
                "methods": list(route.methods),
            }
            routes.append(route_info)
    return routes
