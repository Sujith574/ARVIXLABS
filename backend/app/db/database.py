from sqlalchemy import create_engine, Column, String, DateTime, Enum, Text, Integer, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings
import uuid
from datetime import datetime
import enum
import os

try:
    engine = create_engine(settings.DATABASE_URL)
    # Ping to check if actually connected
    with engine.connect() as conn:
        print(f"[DATABASE] Connected to primary database: {settings.DATABASE_URL.split('@')[-1]}")
except Exception as e:
    # Use SQLite fallback for zero-config production demo
    print(f"[DATABASE] Primary connection failed: {e}")
    print("[DATABASE] Falling back to SQLite for local development/production-demo.")
    # On Windows, ensures the path is handled correctly
    db_path = os.path.join(os.getcwd(), "arvix_demo.db")
    engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})

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

# ── OTP Storage ────────────────────────────────────────────────────────────────
class AdminOTP(Base):
    __tablename__ = "admin_otps"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    otp_code = Column(String)
    expires_at = Column(DateTime)
    is_active = Column(Boolean, default=True)

class ApprovedAdmin(Base):
    __tablename__ = "approved_admins"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    added_at = Column(DateTime, default=datetime.utcnow)
    role = Column(String, default="admin")
