from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VerificationCreate(BaseModel):
    document_id: str
    technician_id: str
    technician_name: str
    device_id: Optional[str] = None
    verification_date: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    result: str


class VerificationBatchCreate(BaseModel):
    verifications: list[VerificationCreate]


class VerificationResponse(BaseModel):
    id: int
    document_id: str
    technician_id: str
    technician_name: str
    device_id: Optional[str]
    verification_date: datetime
    latitude: Optional[float]
    longitude: Optional[float]
    result: str
    synced: bool
    created_at: datetime

    class Config:
        from_attributes = True


class VerificationListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: list[VerificationResponse]
