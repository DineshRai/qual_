from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import registry, relationship


Base = declarative_base()
mapper_registry = registry()

from .models import User, Project, File, Analysis
