from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime, timezone
from app.core.database import Base

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    rating = Column(Integer, default=0)
    user_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class VoterRegistration(Base):
    __tablename__ = "voter_registrations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    father_name = Column(String)
    dob = Column(String)
    gender = Column(String)
    email = Column(String)
    phone = Column(String)
    state = Column(String)
    district = Column(String)
    pincode = Column(String)
    address = Column(Text)
    id_type = Column(String)
    id_number = Column(String)
    status = Column(String, default="pending")
    user_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
