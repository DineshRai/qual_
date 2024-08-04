from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import registry

Base = declarative_base()
mapper_registry = registry()

from .user import User
