from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.alerts import AlertSchema
from models.alerts import Alert
from database import get_db

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.post("/", response_model=AlertSchema)
def create_alert(alert: AlertSchema, db: Session = Depends(get_db)):
    db_alert = Alert(
        timestamp=alert.timestamp,
        site_id=alert.site_id,
        camera_id=alert.camera_id,
        usecase=alert.usecase,
        alert_type=alert.alert_type,
        severity=alert.severity,
        description=alert.description,
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
