from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.sql import func

from app.models.database import Base


class RevokedDocument(Base):
    __tablename__ = "revoked_documents"

    document_id = Column(String(50), primary_key=True)
    reason = Column(Text)
    revoked_by = Column(String(50))
    revoked_at = Column(DateTime(timezone=True), server_default=func.now())
