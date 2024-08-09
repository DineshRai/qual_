from pydantic import BaseModel
from typing import Optional


class CodeBase(BaseModel):
    name: str
    color: str


class CodeCreate(CodeBase):
    pass


class CodeUpdate(CodeBase):
    pass


class Code(CodeBase):
    id: int
    analysis_id: int

    class Config:
        orm_mode = True
