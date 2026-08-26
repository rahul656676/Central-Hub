from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.alerts import Alert
from models.site_health import SiteHealth
import io
import csv

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/health-summary")
def get_health_summary(db: Session = Depends(get_db)):
    """
    Returns AVG HEALTH COMPLIANCE by location
    by calculating avg of gpu, disk, and cameras online.
    """
    # Group by site_id and calculate average metrics
    results = db.query(
        SiteHealth.site_id,
        func.avg(SiteHealth.gpu_util_pct).label('avg_gpu'),
        func.avg(SiteHealth.cameras_online).label('avg_cams_online'),
        func.avg(SiteHealth.cameras_total).label('avg_cams_total')
    ).group_by(SiteHealth.site_id).all()
    
    summary = []
    for r in results:
        # Calculate a mock compliance score (0-100) based on cameras being online
        compliance = (float(r.avg_cams_online) / float(r.avg_cams_total) * 100) if r.avg_cams_total else 0
        summary.append({
            "location": r.site_id,
            "avg_gpu_load": round(float(r.avg_gpu or 0), 2),
            "avg_health_compliance": round(compliance, 2),
            "total_use_cases_active": 9 # Mocked total per location
        })
        
    return {"status": "ok", "data": summary}

@router.get("/export-alerts")
def export_alerts_csv(site_id: str = None, db: Session = Depends(get_db)):
    """
    Downloads alerts in CSV (Excel) format.
    """
    query = db.query(Alert)
    if site_id:
        query = query.filter(Alert.site_id == site_id)
        
    alerts = query.order_by(Alert.detected_at.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Location", "Camera", "Use Case", "Severity", "Timestamp", "Description"])
    
    for alert in alerts:
        desc = alert.metadata_json.get('description', '') if alert.metadata_json else ''
        writer.writerow([
            alert.id, 
            alert.site_id, 
            alert.camera_id, 
            alert.usecase_id, 
            alert.severity, 
            alert.detected_at,
            desc
        ])
        
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=alerts_export_{site_id or 'all'}.csv"}
    )
