from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import models
from app.schemas import analysis as analysis_schema, code as code_schema
from app.middleware.auth import get_current_user

router = APIRouter()


@router.post("/projects/{project_id}/analyses", response_model=analysis_schema.Analysis)
def create_analysis(
    project_id: int,
    analysis: analysis_schema.AnalysisCreate,
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
    if not project:
        raise HTTPException(
            status_code=404, detail="Project not found or you don't have access"
        )

    db_analysis = models.Analysis(**analysis.dict(), project_id=project_id)
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis


@router.get(
    "/projects/{project_id}/analyses", response_model=List[analysis_schema.Analysis]
)
def get_analyses(
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
    if not project:
        raise HTTPException(
            status_code=404, detail="Project not found or you don't have access"
        )

    return (
        db.query(models.Analysis).filter(models.Analysis.project_id == project_id).all()
    )


@router.get(
    "/projects/{project_id}/analyses/{analysis_id}",
    response_model=analysis_schema.AnalysisDetail,
)
def get_analysis(
    project_id: int,
    analysis_id: int,
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
    if not project:
        raise HTTPException(
            status_code=404, detail="Project not found or you don't have access"
        )

    analysis = (
        db.query(models.Analysis)
        .filter(
            models.Analysis.id == analysis_id, models.Analysis.project_id == project_id
        )
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return analysis


@router.post(
    "/projects/{project_id}/analyses/{analysis_id}/codes",
    response_model=code_schema.Code,
)
def create_code(
    project_id: int,
    analysis_id: int,
    code: code_schema.CodeCreate,
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
    if not project:
        raise HTTPException(
            status_code=404, detail="Project not found or you don't have access"
        )

    analysis = (
        db.query(models.Analysis)
        .filter(
            models.Analysis.id == analysis_id, models.Analysis.project_id == project_id
        )
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    db_code = models.Code(**code.dict(), analysis_id=analysis_id)
    db.add(db_code)
    db.commit()
    db.refresh(db_code)
    return db_code


@router.get(
    "/projects/{project_id}/analyses/{analysis_id}/codes",
    response_model=List[code_schema.Code],
)
def get_codes(
    project_id: int,
    analysis_id: int,
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
    if not project:
        raise HTTPException(
            status_code=404, detail="Project not found or you don't have access"
        )

    analysis = (
        db.query(models.Analysis)
        .filter(
            models.Analysis.id == analysis_id, models.Analysis.project_id == project_id
        )
        .first()
    )
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return db.query(models.Code).filter(models.Code.analysis_id == analysis_id).all()
