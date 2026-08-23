from sqlalchemy import Column, Integer, String
from models.base import Base

class Site(Base):
    __tablename__ = "sites"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    status = Column(String, default="active")
