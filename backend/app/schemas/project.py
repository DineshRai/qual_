from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class ProjectDetail(Project):
    files: List["File"] = []
    analyses: List["Analysis"] = []


from .file import File
from .analysis import Analysis

ProjectDetail.update_forward_refs()
