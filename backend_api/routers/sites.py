from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas.sites import SiteSchema
from models.sites import Site
from database import get_db

router = APIRouter(prefix="/sites", tags=["Sites"])

@router.post("/", response_model=SiteSchema)
def create_site(site: SiteSchema, db: Session = Depends(get_db)):
    db_site = Site(**site.dict())
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return db_site

@router.get("/", response_model=List[SiteSchema])
def get_sites(db: Session = Depends(get_db)):
    return db.query(Site).all()
