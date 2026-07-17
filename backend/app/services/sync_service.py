from sqlalchemy.orm import Session
from datetime import datetime

from app.repositories.document_repo import DocumentRepository
from app.repositories.revoked_repo import RevokedRepository


class SyncService:
    def __init__(self, db: Session):
        self.db = db
        self.doc_repo = DocumentRepository(db)
        self.revoked_repo = RevokedRepository(db)

    def get_revoked_list(self, since: datetime = None) -> dict:
        if since:
            revoked = self.revoked_repo.get_since(since)
        else:
            revoked = self.revoked_repo.get_all()

        return {
            "revoked": [
                {
                    "document_id": r.document_id,
                    "revoked_at": r.revoked_at.isoformat() if r.revoked_at else None,
                    "reason": r.reason,
                }
                for r in revoked
            ],
            "last_updated": datetime.utcnow().isoformat(),
        }

    def pull_documents(self, document_ids: list[str]) -> dict:
        documents = []
        for doc_id in document_ids:
            doc = self.doc_repo.get_by_id(doc_id)
            if doc:
                documents.append({
                    "id": doc.id,
                    "client_name": doc.client_name,
                    "transaction_date": doc.transaction_date,
                    "campaign": doc.campaign,
                    "location": doc.location,
                    "hash_document": doc.hash_document,
                    "signature": doc.signature,
                })

        revoked_ids = [r.document_id for r in self.revoked_repo.get_all()]

        return {
            "documents": documents,
            "revoked": revoked_ids,
        }
