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
    bbox: Optional[List[int]] = None
    
    class Config:
        orm_mode = True
