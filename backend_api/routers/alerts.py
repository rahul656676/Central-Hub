from fastapi import APIRouter, HTTPException
from typing import List
from schemas.alerts import AlertSchema
from datetime import datetime

router = APIRouter(prefix="/alerts", tags=["Alerts"])

# Mock in-memory database for testing
mock_alerts = []

@router.post("/", response_model=AlertSchema)
def create_alert(alert: AlertSchema):
    alert.id = len(mock_alerts) + 1
    mock_alerts.append(alert)
    return alert

@router.get("/", response_model=List[AlertSchema])
def get_alerts(site_id: str = None, usecase: str = None):
    results = mock_alerts
    if site_id:
        results = [a for a in results if a.site_id == site_id]
    if usecase:
        results = [a for a in results if a.usecase == usecase]
    return results
