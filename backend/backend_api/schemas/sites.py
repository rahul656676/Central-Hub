from pydantic import BaseModel

class SiteSchema(BaseModel):
    id: str
    name: str
    location: str
    status: str = "active"

    class Config:
        orm_mode = True
