from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import models
from ..schemas import file as file_schema
import shutil
import os
from uuid import uuid4

router = APIRouter()

UPLOAD_DIR = "uploads"


@router.post("/projects/{project_id}/upload", response_model=file_schema.FileResponse)
async def upload_file(
    project_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid4()}{file_extension}"

    project_upload_dir = os.path.join(UPLOAD_DIR, str(project_id))
    os.makedirs(project_upload_dir, exist_ok=True)

    file_path = os.path.join(project_upload_dir, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

  
        db_file = models.File(
            filename=file.filename, file_path=file_path, project_id=project_id
        )
        db.add(db_file)
        db.commit()
        db.refresh(db_file)

        return db_file
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/projects/{project_id}/files", response_model=List[file_schema.FileResponse])
def get_project_files(project_id: int, db: Session = Depends(get_db)):
    files = db.query(models.File).filter(models.File.project_id == project_id).all()
    return files
