from sqlalchemy import Column, String, ForeignKey, DateTime, BigInteger, Numeric, Integer
from sqlalchemy.sql import func
from models.base import Base

class SiteHealth(Base):
    __tablename__ = "site_health"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    site_id = Column(String, ForeignKey("sites.id"))
    reported_at = Column(DateTime(timezone=True), server_default=func.now())
    gpu_util_pct = Column(Numeric)
    disk_free_gb = Column(Numeric)
    cameras_online = Column(Integer)
    cameras_total = Column(Integer)
