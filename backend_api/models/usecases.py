from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from models.base import Base

class UseCase(Base):
    __tablename__ = "usecases"
    id = Column(String, primary_key=True)
    display_name = Column(String, nullable=False)
    description = Column(String)
    config_schema = Column(JSONB)

class CameraUseCase(Base):
    __tablename__ = "camera_usecases"
    id = Column(Integer, primary_key=True, autoincrement=True)
    camera_id = Column(String, ForeignKey("cameras.id"))
    usecase_id = Column(String, ForeignKey("usecases.id"))
    roi = Column(JSONB)
    params = Column(JSONB)
    enabled = Column(Boolean, default=True)
    version = Column(Integer, default=1)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
