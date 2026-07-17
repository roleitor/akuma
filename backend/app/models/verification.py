from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime
from sqlalchemy.sql import func

from app.models.database import Base


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(50), nullable=False, index=True)
    technician_id = Column(String(50), nullable=False)
    technician_name = Column(String(200), nullable=False)
    device_id = Column(String(100))
    verification_date = Column(DateTime(timezone=True), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    result = Column(String(20), nullable=False)
    synced = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
