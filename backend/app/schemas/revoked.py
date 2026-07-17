from pydantic import BaseModel
from typing import Optional


class RevokeDocumentRequest(BaseModel):
    reason: str
    revoked_by: str


class UnrevokeDocumentRequest(BaseModel):
    reason: str
    unrevoked_by: str


class RevokedDocumentResponse(BaseModel):
    document_id: str
    revoked_at: str
    reason: str


class RevokedListResponse(BaseModel):
    revoked: list[RevokedDocumentResponse]
    last_updated: str
