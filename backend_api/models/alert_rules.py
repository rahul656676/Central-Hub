from sqlalchemy import Column, String, ForeignKey, Integer, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from models.base import Base

class AlertRule(Base):
    __tablename__ = "alert_rules"
    id = Column(Integer, primary_key=True, autoincrement=True)
    site_id = Column(String, ForeignKey("sites.id"))
    usecase_id = Column(String, ForeignKey("usecases.id"))
    recipient_name = Column(String)
    recipient_email = Column(String)
    recipient_phone = Column(String)
    is_active = Column(Boolean, default=True)
