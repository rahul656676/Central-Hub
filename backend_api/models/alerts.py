from sqlalchemy import Column, Integer, String, DateTime, JSON
from models.base import Base
import datetime

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    site_id = Column(String, index=True)
    camera_id = Column(String, index=True)
    usecase = Column(String, index=True)
    alert_type = Column(String)
    severity = Column(String)
    description = Column(String)
    bbox = Column(JSON, nullable=True)
