from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from models.base import Base

class CameraUseCase(Base):
    __tablename__ = "camera_usecases"
    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(String, ForeignKey("cameras.id"))
    usecase_name = Column(String)
    settings = Column(JSON)  # Stores ROI polygons, thresholds, etc.
    status = Column(String, default="active")
