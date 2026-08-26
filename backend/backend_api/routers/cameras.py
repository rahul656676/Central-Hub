from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas.cameras import CameraSchema
from models.cameras import Camera
from database import get_db

router = APIRouter(prefix="/cameras", tags=["Cameras"])

@router.post("/", response_model=CameraSchema)
def create_camera(camera: CameraSchema, db: Session = Depends(get_db)):
    db_camera = Camera(**camera.dict())
    db.add(db_camera)
    db.commit()
    db.refresh(db_camera)
    return db_camera

@router.get("/", response_model=List[CameraSchema])
def get_cameras(site_id: str = None, db: Session = Depends(get_db)):
    query = db.query(Camera)
    if site_id:
        query = query.filter(Camera.site_id == site_id)
    return query.all()
