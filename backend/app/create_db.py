import asyncio
import logging
from app.database import async_engine as engine
from app.models import Base, User  
from sqlalchemy.sql import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_tables():
    logger.info(f"Registered models: {User.__name__}")  
    logger.info(f"Base metadata tables: {Base.metadata.tables.keys()}")
    async with engine.begin() as conn:
        logger.info("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Tables created successfully.")
        result = await conn.execute(
            text("SELECT name FROM sqlite_master WHERE type='table';")
        )
        tables = result.fetchall()
        logger.info(f"Tables in the database after creation: {tables}")


if __name__ == "__main__":
    asyncio.run(create_tables())