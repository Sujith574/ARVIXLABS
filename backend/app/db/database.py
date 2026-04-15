from sqlalchemy import create_engine, Column, String, DateTime, Enum, Text, Integer, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
import uuid
from datetime import datetime
import enum

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Enums
class UserRole(str, enum.Enum):
    super_admin = "super_admin"
    officer = "officer"
    analyst = "analyst"
    citizen = "citizen"

class ComplaintStatus(str, enum.Enum):
    submitted = "submitted"
    under_review = "under_review"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class Priority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"
