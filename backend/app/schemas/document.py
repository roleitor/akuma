from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class DocumentCreate(BaseModel):
    id: str
    client_name: str
    transaction_date: str
    campaign: Optional[str] = None
    location: Optional[str] = None
    form_data: dict[str, Any]


class DocumentResponse(BaseModel):
    id: str
    client_name: str
    transaction_date: str
    campaign: Optional[str]
    location: Optional[str]
    form_data: dict[str, Any]
    hash_document: str
    signature: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocumentStatusResponse(BaseModel):
    id: str
    status: str
    revoked: bool
    last_verification: Optional[datetime]


class QRPayload(BaseModel):
    v: str
    txn: str
    cli: str
    fec: str
    cam: Optional[str]
    loc: Optional[str]
    ts: int
    sig: str
