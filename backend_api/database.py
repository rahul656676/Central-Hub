from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.base import Base
import os

# Use SQLite for rapid local testing, can easily be swapped to PostgreSQL later
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./central_hub.db")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
