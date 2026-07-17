from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.models.revoked import RevokedDocument


class RevokedRepository:
    def __init__(self, db: Session):
        self.db = db

    def revoke(self, document_id: str, reason: str, revoked_by: str) -> RevokedDocument:
        db_revoked = RevokedDocument(
            document_id=document_id,
            reason=reason,
            revoked_by=revoked_by,
        )
        self.db.add(db_revoked)
        self.db.commit()
        self.db.refresh(db_revoked)
        return db_revoked

    def unrevoke(self, document_id: str) -> bool:
        db_revoked = self.db.query(RevokedDocument).filter(RevokedDocument.document_id == document_id).first()
        if not db_revoked:
            return False
        self.db.delete(db_revoked)
        self.db.commit()
        return True

    def is_revoked(self, document_id: str) -> bool:
        return self.db.query(RevokedDocument).filter(RevokedDocument.document_id == document_id).first() is not None

    def get_all(self) -> list[RevokedDocument]:
        return self.db.query(RevokedDocument).all()

    def get_since(self, since: datetime) -> list[RevokedDocument]:
        return self.db.query(RevokedDocument).filter(RevokedDocument.revoked_at >= since).all()
