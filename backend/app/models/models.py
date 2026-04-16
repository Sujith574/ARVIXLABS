from sqlalchemy import Column, String, DateTime, Enum, Text, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base, UserRole, ComplaintStatus, Priority
import uuid
from datetime import datetime

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.citizen)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    complaints = relationship("Complaint", foreign_keys="[Complaint.user_id]", back_populates="user")
    assigned_complaints = relationship("Complaint", foreign_keys="[Complaint.assigned_to]")


class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    head_officer_id = Column(String, ForeignKey("users.id"), nullable=True)
    sla_hours = Column(Integer, default=72)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaints = relationship("Complaint", back_populates="department")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaints = relationship("Complaint", back_populates="category")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, default=gen_uuid)
    ticket_id = Column(String(20), unique=True, nullable=False)  # e.g. ALX-20240001
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.submitted)
    priority = Column(Enum(Priority), default=Priority.medium)

    user_id = Column(String, ForeignKey("users.id"))
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    category_id = Column(String, ForeignKey("categories.id"), nullable=True)
    assigned_to = Column(String, ForeignKey("users.id"), nullable=True)

    ai_category = Column(String, nullable=True)
    ai_priority = Column(String, nullable=True)
    ai_summary = Column(Text, nullable=True)
    embedding_id = Column(String, nullable=True)  # FAISS index reference

    attachment_url = Column(String, nullable=True)
    sla_deadline = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id], back_populates="complaints")
    department = relationship("Department", back_populates="complaints")
    category = relationship("Category", back_populates="complaints")


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    action = Column(String(255), nullable=False)
    resource_type = Column(String(100))
    resource_id = Column(String)
    details = Column(Text)
    ip_address = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
