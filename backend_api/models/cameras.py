from sqlalchemy import Column, Integer, String, ForeignKey
from models.base import Base

class Camera(Base):
    __tablename__ = "cameras"
    id = Column(String, primary_key=True, index=True)
    site_id = Column(String, ForeignKey("sites.id"))
    name = Column(String)
    rtsp_url = Column(String)
    status = Column(String, default="active")
