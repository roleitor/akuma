from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from app.models.database import get_db
from app.services.sync_service import SyncService

router = APIRouter(prefix="/sync", tags=["sync"])


class PullRequest(BaseModel):
    last_sync: Optional[str] = None
    document_ids: list[str] = []


@router.get("/revoked", response_model=dict)
def get_revoked_list(db: Session = Depends(get_db)):
    service = SyncService(db)
    return service.get_revoked_list()


@router.post("/pull", response_model=dict)
def pull_documents(request: PullRequest, db: Session = Depends(get_db)):
    service = SyncService(db)
    return service.pull_documents(request.document_ids)
