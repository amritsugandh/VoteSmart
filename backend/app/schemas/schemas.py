from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    state: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    token: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    state: Optional[str] = None
    language: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ChatRequest(BaseModel):
    message: str
    state: Optional[str] = None
    lang: str = "en"

class ChatResponse(BaseModel):
    response: str

class FeedbackCreate(BaseModel):
    type: str
    message: str
    rating: int = 0

class RegistrationCreate(BaseModel):
    name: str
    fatherName: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    address: Optional[str] = None
    idType: Optional[str] = None
    idNumber: Optional[str] = None

class RegistrationResponse(BaseModel):
    id: int
    name: str
    father_name: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    pincode: Optional[str] = None
    address: Optional[str] = None
    id_type: Optional[str] = None
    id_number: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class StatusUpdate(BaseModel):
    status: str
