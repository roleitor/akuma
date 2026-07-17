from sqlalchemy import Column, String, JSON, DateTime, Boolean, Text
from sqlalchemy.sql import func

from app.models.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(50), primary_key=True)
    client_name = Column(String(200), nullable=False)
    transaction_date = Column(String(10), nullable=False)
    campaign = Column(String(100))
    location = Column(String(200))
    form_data = Column(JSON, nullable=False)
    hash_document = Column(String(64), nullable=False)
    signature = Column(Text, nullable=False)
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
