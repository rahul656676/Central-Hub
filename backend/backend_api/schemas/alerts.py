from pydantic import BaseModel
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
