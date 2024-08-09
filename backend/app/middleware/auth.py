import logging

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import models

security = HTTPBearer()

logger = logging.getLogger(__name__)

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        logger.error("No credentials provided")
        raise HTTPException(status_code=401, detail="No credentials provided")
    
    token = credentials.credentials
    if not token:
        logger.error("Token is null or empty")
        raise HTTPException(status_code=401, detail="Token is null or empty")

    logger.info(f"Attempting to verify token: {token[:10]}...")  # Log first 10 chars for security
    try:
        decoded_token = auth.verify_id_token(token)
        logger.info(f"Token verified successfully for UID: {decoded_token['uid']}")
        return decoded_token
    except auth.InvalidIdTokenError:
        logger.error("Invalid token")
        raise HTTPException(status_code=401, detail="Invalid token")
    except auth.ExpiredIdTokenError:
        logger.error("Token has expired")
        raise HTTPException(status_code=401, detail="Token has expired")
    except Exception as e:
        logger.error(f"Authentication failed: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


async def get_current_user(
    token: dict = Depends(verify_token), db: Session = Depends(get_db)
):
    try:
        user = (
            db.query(models.User)
            .filter(models.User.firebase_uid == token["uid"])
            .first()
        )
        if not user:
            # Create a new user if they don't exist in the database
            user = models.User(firebase_uid=token["uid"], email=token.get("email"))
            db.add(user)
            db.commit()
            db.refresh(user)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid user: {str(e)}")