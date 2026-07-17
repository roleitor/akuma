from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.schemas.document import DocumentCreate, DocumentResponse
from app.services.document_service import DocumentService

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("", response_model=dict, status_code=201)
def create_document(document_data: DocumentCreate, db: Session = Depends(get_db)):
    service = DocumentService(db)
    existing = service.get_document(document_data.id)
    if existing:
        raise HTTPException(status_code=409, detail="Document already exists")
    return service.create_document(document_data)


@router.get("/{document_id}", response_model=dict)
def get_document(document_id: str, db: Session = Depends(get_db)):
    service = DocumentService(db)
    document = service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"success": True, "data": document}


@router.get("/{document_id}/status", response_model=dict)
def get_document_status(document_id: str, db: Session = Depends(get_db)):
    service = DocumentService(db)
    status = service.get_status(document_id)
    if not status:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"success": True, "data": status}


@router.post("/{document_id}/revoke", response_model=dict)
def revoke_document(document_id: str, reason: str, revoked_by: str, db: Session = Depends(get_db)):
    service = DocumentService(db)
    success = service.revoke_document(document_id, reason, revoked_by)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"success": True, "message": "Document revoked"}


@router.post("/{document_id}/unrevoke", response_model=dict)
def unrevoke_document(document_id: str, db: Session = Depends(get_db)):
    service = DocumentService(db)
    success = service.unrevoke_document(document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"success": True, "message": "Document restored"}
