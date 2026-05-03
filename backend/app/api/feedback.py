from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.feedback import Feedback
from app.schemas.schemas import FeedbackCreate

router = APIRouter(tags=["Feedback"])

@router.post("/feedback")
def submit_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):
    fb = Feedback(type=data.type, message=data.message, rating=data.rating)
    db.add(fb)
    db.commit()
    return {"status": "success", "message": "Feedback received"}
@router.get("/feedback/all")
def get_all_feedback(db: Session = Depends(get_db)):
    return db.query(Feedback).order_by(Feedback.created_at.desc()).all()
