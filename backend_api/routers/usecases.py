from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas.usecases import CameraUseCaseSchema
from models.usecases import CameraUseCase
from database import get_db

router = APIRouter(prefix="/usecases", tags=["Use Cases"])

@router.post("/", response_model=CameraUseCaseSchema)
def configure_usecase(usecase: CameraUseCaseSchema, db: Session = Depends(get_db)):
    db_uc = CameraUseCase(**usecase.dict(exclude={'id'}))
    db.add(db_uc)
    db.commit()
    db.refresh(db_uc)
    return db_uc

@router.get("/", response_model=List[CameraUseCaseSchema])
def get_usecases(camera_id: str = None, db: Session = Depends(get_db)):
    query = db.query(CameraUseCase)
    if camera_id:
        query = query.filter(CameraUseCase.camera_id == camera_id)
    return query.all()
