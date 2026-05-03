from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.schemas import UserCreate, UserLogin, UserResponse, TokenResponse, GoogleAuthRequest
from google.oauth2 import id_token
from google.auth.transport import requests
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        phone=data.phone,
        state=data.state
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )

@router.post("/google", response_model=TokenResponse)
def google_login(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        client_id = os.environ.get("VITE_GOOGLE_CLIENT_ID")
        if client_id:
            idinfo = id_token.verify_oauth2_token(data.token, requests.Request(), client_id)
        else:
            idinfo = id_token.verify_oauth2_token(data.token, requests.Request())
            
        email = idinfo.get('email')
        name = idinfo.get('name')
        
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            user = User(
                name=name,
                email=email,
                hashed_password=None,
                auth_provider="google"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        token = create_access_token({"sub": str(user.id)})
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user)
        )
        
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google token: {str(e)}")
