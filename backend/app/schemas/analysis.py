from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class AnalysisBase(BaseModel):
    name: str
    description: Optional[str] = None


class AnalysisCreate(AnalysisBase):
    pass


class AnalysisUpdate(AnalysisBase):
    pass


class Analysis(AnalysisBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class AnalysisDetail(Analysis):
    codes: List["Code"] = []


from .code import Code

AnalysisDetail.update_forward_refs()
