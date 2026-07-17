from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.repositories.verification_repo import VerificationRepository
from app.repositories.document_repo import DocumentRepository
from app.repositories.revoked_repo import RevokedRepository
from app.schemas.verification import VerificationCreate


class VerificationService:
    def __init__(self, db: Session):
        self.db = db
        self.verification_repo = VerificationRepository(db)
        self.doc_repo = DocumentRepository(db)
        self.revoked_repo = RevokedRepository(db)

    def create_verification(self, verification_data: VerificationCreate) -> dict:
        verification = self.verification_repo.create(verification_data)
        return {
            "id": verification.id,
            "document_id": verification.document_id,
            "created_at": verification.created_at,
        }

    def create_batch(self, verifications: list[VerificationCreate]) -> dict:
        results = []
        failed = 0
        for v in verifications:
            try:
                result = self.create_verification(v)
                results.append({"id": v.document_id, "status": "synced"})
            except Exception:
                results.append({"id": v.document_id, "status": "failed"})
                failed += 1
        return {"synced": len(results) - failed, "failed": failed, "results": results}

    def list_verifications(
        self,
        technician_id: Optional[str] = None,
        document_id: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        page: int = 1,
        limit: int = 20,
    ) -> dict:
        items, total = self.verification_repo.list_all(page, limit)
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "items": [
                {
                    "id": v.id,
                    "document_id": v.document_id,
                    "technician_id": v.technician_id,
                    "technician_name": v.technician_name,
                    "verification_date": v.verification_date,
                    "result": v.result,
                }
                for v in items
            ],
        }
