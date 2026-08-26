from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.site_health import SiteHealth
from models.usecases import CameraUseCase

router = APIRouter(prefix="/sync", tags=["Sync"])

@router.get("/config/{site_id}")
def get_site_config(site_id: str, db: Session = Depends(get_db)):
    # Pulls all camera use cases for a specific site
    # This simulates the central DB answering a sync request from an edge server
    # Note: Requires a JOIN between cameras and camera_usecases in real implementation
    return {"status": "ok", "usecases": []}

@router.post("/health/")
def update_site_health(payload: dict, db: Session = Depends(get_db)):
    health_record = SiteHealth(
        site_id=payload.get("site_id"),
        gpu_util_pct=payload.get("gpu_util_pct"),
        disk_free_gb=payload.get("disk_free_gb"),
        cameras_online=payload.get("cameras_online"),
        cameras_total=payload.get("cameras_total")
    )
    db.add(health_record)
    db.commit()
    return {"status": "health updated"}
