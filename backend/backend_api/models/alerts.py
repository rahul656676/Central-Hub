from sqlalchemy import Column, String, ForeignKey, Boolean, DateTime, BigInteger, Float
from models.base import Base

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    site_id = Column(String)
    camera_id = Column(String)
    usecase = Column(String)
    alert_type = Column(String)
    severity = Column(String, default="info")
    timestamp = Column(DateTime(timezone=True), nullable=False)
    description = Column(String)
    snapshot_url = Column(String)
    confidence = Column(Float)
    bbox = Column(String) # Store as JSON string for SQLite compat
    synced_to_hq = Column(Boolean, default=False)
