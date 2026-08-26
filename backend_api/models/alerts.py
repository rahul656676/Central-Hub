from sqlalchemy import Column, String, ForeignKey, Boolean, DateTime, BigInteger
from sqlalchemy.dialects.postgresql import JSONB
from models.base import Base

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    site_id = Column(String, ForeignKey("sites.id"))
    camera_id = Column(String, ForeignKey("cameras.id"))
    usecase_id = Column(String, ForeignKey("usecases.id"))
    severity = Column(String, default="info")
    detected_at = Column(DateTime(timezone=True), nullable=False)
    clip_path = Column(String)
    metadata_json = Column("metadata", JSONB)
    synced_to_hq = Column(Boolean, default=False)
