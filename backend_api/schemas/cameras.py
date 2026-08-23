from pydantic import BaseModel

class CameraSchema(BaseModel):
    id: str
    site_id: str
    name: str
    rtsp_url: str
    status: str = "active"

    class Config:
        orm_mode = True
