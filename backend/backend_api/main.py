from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from routers import alerts, sites, cameras, usecases, sync, reports
from auth import jwt_handler
from database import engine
from models.base import Base

# Import all models to ensure they are registered with Base
from models import alerts as alerts_model
from models import sites as sites_model
from models import cameras as cameras_model
from models import usecases as usecases_model
from models import site_health as site_health_model
from models import alert_rules as alert_rules_model

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Central Hub - Backend API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alerts.router)
app.include_router(sites.router)
app.include_router(cameras.router)
app.include_router(usecases.router)
app.include_router(sync.router)
app.include_router(reports.router)
app.include_router(jwt_handler.router, prefix="/auth", tags=["Auth"])

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Central Hub Backend API"}
