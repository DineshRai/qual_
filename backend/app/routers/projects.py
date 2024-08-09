from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import project as project_schema
from ..middleware.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=project_schema.Project)
async def create_project(
    project: project_schema.ProjectCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    print(f"Attempting to create project for user: {current_user.id}")
    
    db_project = models.Project(**project.dict(), owner_id=current_user.id)
    db_project.members.append(current_user)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.get("/", response_model=List[project_schema.Project])
async def get_projects(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.Project)
        .filter(models.Project.members.contains(current_user))
        .all()
    )


@router.get("/{project_id}", response_model=project_schema.ProjectDetail)
async def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    project = (
        db.query(models.Project)
        .filter(
            models.Project.id == project_id,
            models.Project.members.contains(current_user),
        )
        .first()
    )
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.put("/{project_id}", response_model=project_schema.Project)
async def update_project(
    project_id: int,
    project_update: project_schema.ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_project = (
        db.query(models.Project)
        .filter(
            models.Project.id == project_id, models.Project.owner_id == current_user.id
        )
        .first()
    )
    if db_project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found or you don't have permission to update",
        )

    for var, value in vars(project_update).items():
        setattr(db_project, var, value) if value else None

    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_project = (
        db.query(models.Project)
        .filter(
            models.Project.id == project_id, models.Project.owner_id == current_user.id
        )
        .first()
    )
    if db_project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found or you don't have permission to delete",
        )

    db.delete(db_project)
    db.commit()
    return {"ok": True}
