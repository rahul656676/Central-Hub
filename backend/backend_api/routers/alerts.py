from fastapi import APIRouter, Depends, HTTPException, Security
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
