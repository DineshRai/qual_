from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from firebase_admin import auth
from firebase_admin._auth_utils import InvalidIdTokenError
from app.models.user import User
from app.schemas import UserCreate, UserResponse
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
import logging

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received registration request: {user}")
    try:
        firebase_user = auth.create_user(email=user.email, password=user.password)
        db_user = User(firebase_uid=firebase_user.uid, email=user.email)
        db.add(db_user)
        await db.commit()  
        await db.refresh(db_user)  

        return UserResponse(
            id=db_user.id, email=db_user.email, firebase_uid=db_user.firebase_uid
        )
    except auth.EmailAlreadyExistsError:
        logger.error("Email already registered")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    except Exception as e:
        logger.error(f"Internal server error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    logger.info(f"Received login request for email: {form_data.username}")
    try:
        # Verify the email and password using Firebase Auth
        user = auth.get_user_by_email(form_data.username)
        
        # Attempt to sign in with email and password
        auth_result = auth.verify_password(form_data.username, form_data.password)
        
        if not auth_result:
            raise auth.InvalidPasswordError()

        # Generate a custom token for the authenticated user
        custom_token = auth.create_custom_token(user.uid)
        
        return {"access_token": custom_token, "token_type": "bearer"}
    except (auth.UserNotFoundError, auth.InvalidPasswordError):
        logger.error("Incorrect email or password")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    except InvalidIdTokenError:
        logger.error("Invalid token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    except Exception as e:
        logger.error(f"Internal server error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )