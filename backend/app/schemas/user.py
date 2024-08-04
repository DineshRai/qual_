from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    firebase_uid: str

    class Config:
        orm_mode = True
