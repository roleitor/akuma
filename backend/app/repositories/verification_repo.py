from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.models.verification import Verification
from app.schemas.verification import VerificationCreate


class VerificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, verification_data: VerificationCreate) -> Verification:
        db_verification = Verification(
            document_id=verification_data.document_id,
            technician_id=verification_data.technician_id,
            technician_name=verification_data.technician_name,
            device_id=verification_data.device_id,
            verification_date=verification_data.verification_date,
            latitude=verification_data.latitude,
            longitude=verification_data.longitude,
            result=verification_data.result,
        )
        self.db.add(db_verification)
        self.db.commit()
        self.db.refresh(db_verification)
        return db_verification

    def create_batch(self, verifications: list[VerificationCreate]) -> list[Verification]:
        results = []
        for v in verifications:
            results.append(self.create(v))
        return results

    def get_by_document(self, document_id: str) -> list[Verification]:
        return self.db.query(Verification).filter(Verification.document_id == document_id).all()

    def get_by_technician(
        self, technician_id: str, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None
    ) -> list[Verification]:
        query = self.db.query(Verification).filter(Verification.technician_id == technician_id)
        if start_date:
            query = query.filter(Verification.verification_date >= start_date)
        if end_date:
            query = query.filter(Verification.verification_date <= end_date)
        return query.all()

    def list_all(self, page: int = 1, limit: int = 20) -> tuple[list[Verification], int]:
        total = self.db.query(Verification).count()
        items = self.db.query(Verification).offset((page - 1) * limit).limit(limit).all()
        return items, total
