from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.db.database import UserRole, ComplaintStatus, Priority

# ─── AUTH ────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[UserRole] = UserRole.citizen

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    name: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    sla_hours: Optional[int] = 72

class DepartmentOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    sla_hours: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ─── CATEGORIES ──────────────────────────────────────────────────────────────
class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    department_id: Optional[str] = None

class CategoryOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    department_id: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ─── COMPLAINTS ──────────────────────────────────────────────────────────────
class ComplaintCreate(BaseModel):
    title: str
    description: str
    category_id: Optional[str] = None

class ComplaintOut(BaseModel):
    id: str
    ticket_id: str
    title: str
    description: str
    status: ComplaintStatus
    priority: Priority
    ai_category: Optional[str]
    ai_priority: Optional[str]
    ai_summary: Optional[str]
    department_id: Optional[str]
    category_id: Optional[str]
    attachment_url: Optional[str]
    sla_deadline: Optional[datetime]
    resolved_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class ComplaintStatusUpdate(BaseModel):
    status: ComplaintStatus
    assigned_to: Optional[str] = None

# ─── AI ──────────────────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    sources: Optional[list] = []

class DataIngestRequest(BaseModel):
    source_type: str  # "csv" | "json"
    description: Optional[str] = None
