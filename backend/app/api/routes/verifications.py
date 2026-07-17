from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.models.database import get_db
from app.schemas.verification import VerificationCreate, VerificationBatchCreate
from app.services.verification_service import VerificationService

router = APIRouter(prefix="/verifications", tags=["verifications"])


@router.post("", response_model=dict, status_code=201)
def create_verification(verification_data: VerificationCreate, db: Session = Depends(get_db)):
    service = VerificationService(db)
    return service.create_verification(verification_data)


@router.post("/batch", response_model=dict)
def create_verification_batch(batch: VerificationBatchCreate, db: Session = Depends(get_db)):
    service = VerificationService(db)
    return service.create_batch(batch.verifications)


@router.get("", response_model=dict)
def list_verifications(
    technician_id: str = Query(None),
    document_id: str = Query(None),
    start_date: datetime = Query(None),
    end_date: datetime = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    service = VerificationService(db)
    return service.list_verifications(
        technician_id=technician_id,
        document_id=document_id,
        start_date=start_date,
        end_date=end_date,
        page=page,
        limit=limit,
    )
