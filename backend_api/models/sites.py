from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from models.base import Base

class Site(Base):
    __tablename__ = "sites"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String)
    timezone = Column(String, default="Africa/Dar_es_Salaam")
    vpn_status = Column(String, default="unknown")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
