from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from models.base import Base

class Camera(Base):
    __tablename__ = "cameras"
    id = Column(String, primary_key=True)
    site_id = Column(String, ForeignKey("sites.id"))
    name = Column(String, nullable=False)
    rtsp_url = Column(String, nullable=False)
    status = Column(String, default="pending")
    last_frame_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
