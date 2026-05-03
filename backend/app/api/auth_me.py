from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, require_auth
from app.models.user import User
from app.schemas.schemas import UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(require_auth)):
    return UserResponse.model_validate(user)
