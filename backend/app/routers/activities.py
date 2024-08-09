from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import models
from app.schemas import activity as activity_schema
from app.middleware.auth import get_current_user

router = APIRouter()


@router.get("/recent-activities", response_model=List[activity_schema.Activity])
def get_recent_activities(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    limit: int = 10,
):
    activities = (
        db.query(models.Activity)
        .filter(models.Activity.user_id == current_user.id)
        .order_by(models.Activity.timestamp.desc())
        .limit(limit)
        .all()
    )
    return activities


@router.post("/activities", response_model=activity_schema.Activity)
def create_activity(
    activity: activity_schema.ActivityBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_activity = models.Activity(**activity.dict(), user_id=current_user.id)
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity


@router.get(
    "/projects/{project_id}/activities", response_model=List[activity_schema.Activity]
)
def get_project_activities(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    limit: int = 10,
):
    project = (
        db.query(models.Project)
        .filter(
            models.Project.id == project_id,
            models.Project.members.contains(current_user),
        )
        .first()
    )
    if not project:
        raise HTTPException(
            status_code=404, detail="Project not found or you don't have access"
        )

    activities = (
        db.query(models.Activity)
        .filter(models.Activity.project_id == project_id)
        .order_by(models.Activity.timestamp.desc())
        .limit(limit)
        .all()
    )
    return activities
