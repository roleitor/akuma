from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.models.document import Document
from app.schemas.document import DocumentCreate


class DocumentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, document_id: str) -> Optional[Document]:
        return self.db.query(Document).filter(Document.id == document_id).first()

    def create(self, document_data: DocumentCreate, hash_document: str, signature: str) -> Document:
        db_document = Document(
            id=document_data.id,
            client_name=document_data.client_name,
            transaction_date=document_data.transaction_date,
            campaign=document_data.campaign,
            location=document_data.location,
            form_data=document_data.form_data,
            hash_document=hash_document,
            signature=signature,
        )
        self.db.add(db_document)
        self.db.commit()
        self.db.refresh(db_document)
        return db_document

    def get_status(self, document_id: str) -> Optional[dict]:
        doc = self.get_by_id(document_id)
        if not doc:
            return None
        return {
            "id": doc.id,
            "status": doc.status,
            "revoked": doc.status == "revoked",
        }

    def revoke(self, document_id: str, reason: str, revoked_by: str) -> bool:
        doc = self.get_by_id(document_id)
        if not doc:
            return False
        doc.status = "revoked"
        self.db.commit()
        return True

    def unrevoke(self, document_id: str) -> bool:
        doc = self.get_by_id(document_id)
        if not doc:
            return False
        doc.status = "active"
        self.db.commit()
        return True
