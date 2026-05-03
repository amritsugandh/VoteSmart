from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.feedback import VoterRegistration
from app.schemas.schemas import RegistrationCreate, RegistrationResponse, StatusUpdate

router = APIRouter(tags=["Registration"])

@router.post("/registration/submit")
def submit_registration(data: RegistrationCreate, db: Session = Depends(get_db)):
    reg = VoterRegistration(
        name=data.name, father_name=data.fatherName, dob=data.dob,
        gender=data.gender, email=data.email, phone=data.phone,
        state=data.state, district=data.district, pincode=data.pincode,
        address=data.address, id_type=data.idType, id_number=data.idNumber
    )
    db.add(reg)
    db.commit()
    db.refresh(reg)
    return {"status": "success", "id": reg.id, "message": "Registration submitted"}

@router.get("/registration/status/{reg_id}")
def get_status(reg_id: int, db: Session = Depends(get_db)):
    reg = db.query(VoterRegistration).filter(VoterRegistration.id == reg_id).first()
    if not reg:
        return {"status": "not_found"}
    return {"id": reg.id, "name": reg.name, "status": reg.status}

@router.get("/registration/all", response_model=List[RegistrationResponse])
def get_all_registrations(db: Session = Depends(get_db)):
    """Fetch all voter registrations (Admin Dashboard use case)"""
    registrations = db.query(VoterRegistration).all()
    return registrations

@router.put("/registration/{reg_id}/status")
def update_status(reg_id: int, status_update: StatusUpdate, db: Session = Depends(get_db)):
    """Update voter registration status"""
    reg = db.query(VoterRegistration).filter(VoterRegistration.id == reg_id).first()
    if not reg:
        return {"status": "not_found"}
    
    reg.status = status_update.status
    db.commit()
    db.refresh(reg)
    return {"status": "success", "new_status": reg.status}
