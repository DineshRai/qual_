from pydantic import BaseModel
from datetime import datetime
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from .project import Project

class FileBase(BaseModel):
    filename: str
    file_path: str

class FileCreate(FileBase):
    project_id: int

class File(FileBase):
    id: int
    project_id: int
    upload_date: datetime
    project: Optional['Project'] = None

    class Config:
        orm_mode = True

FileResponse = File