from sqlalchemy.orm import Session
from typing import Optional
import time
import hashlib
import base64
import json

from app.repositories.document_repo import DocumentRepository
from app.repositories.revoked_repo import RevokedRepository
from app.schemas.document import DocumentCreate
from app.core.security import calculate_hash, sign_data


class DocumentService:
    def __init__(self, db: Session):
        self.db = db
        self.doc_repo = DocumentRepository(db)
        self.revoked_repo = RevokedRepository(db)

    def create_document(self, document_data: DocumentCreate) -> dict:
        data_for_hash = {
            "id": document_data.id,
            "client_name": document_data.client_name,
            "transaction_date": document_data.transaction_date,
            "campaign": document_data.campaign or "",
            "location": document_data.location or "",
        }

        hash_document = calculate_hash(data_for_hash)
        signature = sign_data(data_for_hash)

        document = self.doc_repo.create(document_data, hash_document, signature)

        qr_payload = {
            "v": "1.0",
            "txn": document.id,
            "cli": document.client_name,
            "fec": document.transaction_date,
            "cam": document.campaign,
            "loc": document.location,
            "ts": int(time.time()),
            "sig": signature,
        }

        return {
            "id": document.id,
            "hash": hash_document,
            "signature": signature,
            "qr_payload": qr_payload,
            "created_at": document.created_at,
        }

    def get_document(self, document_id: str) -> Optional[dict]:
        doc = self.doc_repo.get_by_id(document_id)
        if not doc:
            return None
        return {
            "id": doc.id,
            "client_name": doc.client_name,
            "transaction_date": doc.transaction_date,
            "campaign": doc.campaign,
            "location": doc.location,
            "form_data": doc.form_data,
            "hash_document": doc.hash_document,
            "signature": doc.signature,
            "status": doc.status,
            "created_at": doc.created_at,
            "updated_at": doc.updated_at,
        }

    def get_status(self, document_id: str) -> Optional[dict]:
        return self.doc_repo.get_status(document_id)

    def revoke_document(self, document_id: str, reason: str, revoked_by: str) -> bool:
        if not self.doc_repo.get_by_id(document_id):
            return False
        self.revoked_repo.revoke(document_id, reason, revoked_by)
        return self.doc_repo.revoke(document_id, reason, revoked_by)

    def unrevoke_document(self, document_id: str) -> bool:
        self.revoked_repo.unrevoke(document_id)
        return self.doc_repo.unrevoke(document_id)
