import os
import re

# 1. Update backend models/alerts.py
models_alerts = '''from sqlalchemy import Column, String, ForeignKey, Boolean, DateTime, BigInteger, Float
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
'''
with open('backend/backend_api/models/alerts.py', 'w') as f:
    f.write(models_alerts)


# 2. Update backend schemas/alerts.py
schemas_alerts = '''from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AlertSchema(BaseModel):
    id: Optional[int] = None
    timestamp: datetime
    site_id: str
    camera_id: str
    usecase: str
    alert_type: str
    severity: str
    description: str
    snapshot_url: Optional[str] = None
    confidence: Optional[float] = None
    bbox: Optional[str] = None
    
    class Config:
        orm_mode = True
'''
with open('backend/backend_api/schemas/alerts.py', 'w') as f:
    f.write(schemas_alerts)


# 3. Update backend routers/alerts.py to use authentication and new fields
routers_alerts = '''from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from typing import List
from schemas.alerts import AlertSchema
from models.alerts import Alert
from database import get_db

router = APIRouter(prefix="/alerts", tags=["Alerts"])

# Simple API Key auth for edge nodes
api_key_header = APIKeyHeader(name="X-Edge-Token", auto_error=False)

def verify_edge_token(api_key: str = Security(api_key_header)):
    # In production, check against DB or env variables
    if api_key != "aws_edge_super_secret_token_2026":
        raise HTTPException(status_code=403, detail="Invalid Edge Token")
    return api_key

@router.post("/", response_model=AlertSchema)
def create_alert(alert: AlertSchema, db: Session = Depends(get_db), token: str = Depends(verify_edge_token)):
    db_alert = Alert(
        timestamp=alert.timestamp,
        site_id=alert.site_id,
        camera_id=alert.camera_id,
        usecase=alert.usecase,
        alert_type=alert.alert_type,
        severity=alert.severity,
        description=alert.description,
        snapshot_url=alert.snapshot_url,
        confidence=alert.confidence,
        bbox=alert.bbox
    )
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

@router.get("/", response_model=List[AlertSchema])
def get_alerts(site_id: str = None, usecase: str = None, limit: int = 50, db: Session = Depends(get_db)):
    query = db.query(Alert)
    if site_id:
        query = query.filter(Alert.site_id == site_id)
    if usecase:
        query = query.filter(Alert.usecase == usecase)
    return query.order_by(Alert.timestamp.desc()).limit(limit).all()
'''
with open('backend/backend_api/routers/alerts.py', 'w') as f:
    f.write(routers_alerts)

# 4. We must delete the old sqlite DB so it gets recreated with new schema
if os.path.exists('backend/backend_api/central_hub.db'):
    os.remove('backend/backend_api/central_hub.db')

