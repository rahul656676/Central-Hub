from pydantic import BaseModel
from typing import Dict, Any

class CameraUseCaseSchema(BaseModel):
    id: int = None
    camera_id: str
    usecase_name: str
    settings: Dict[str, Any]
    status: str = "active"

    class Config:
        orm_mode = True
