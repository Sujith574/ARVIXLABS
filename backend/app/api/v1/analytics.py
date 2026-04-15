from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.models import Complaint, User, Department, Category
from app.core.security import require_role
from typing import List

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
async def get_overview(
    current_user: dict = Depends(require_role("analyst", "officer", "super_admin")),
    db: Session = Depends(get_db)
):
    total = db.query(Complaint).count()
    resolved = db.query(Complaint).filter(Complaint.status == "resolved").count()
    pending = db.query(Complaint).filter(Complaint.status == "submitted").count()
    in_progress = db.query(Complaint).filter(Complaint.status == "in_progress").count()
    critical = db.query(Complaint).filter(Complaint.priority == "critical").count()

    return {
        "total": total,
        "resolved": resolved,
        "pending": pending,
        "in_progress": in_progress,
        "critical": critical,
        "resolution_rate": round((resolved / total * 100) if total > 0 else 0, 1),
        "total_users": db.query(User).count(),
        "total_departments": db.query(Department).count(),
    }

@router.get("/by-department")
async def by_department(
    current_user: dict = Depends(require_role("analyst", "officer", "super_admin")),
    db: Session = Depends(get_db)
):
    results = db.query(
        Department.name,
        func.count(Complaint.id).label("count")
    ).join(Complaint, Complaint.department_id == Department.id, isouter=True) \
     .group_by(Department.name).all()

    return [{"department": r[0], "count": r[1]} for r in results]

@router.get("/by-category")
async def by_category(
    current_user: dict = Depends(require_role("analyst", "officer", "super_admin")),
    db: Session = Depends(get_db)
):
    results = db.query(
        Complaint.ai_category,
        func.count(Complaint.id).label("count")
    ).group_by(Complaint.ai_category).all()

    return [{"category": r[0] or "Uncategorized", "count": r[1]} for r in results]

@router.get("/by-priority")
async def by_priority(
    current_user: dict = Depends(require_role("analyst", "officer", "super_admin")),
    db: Session = Depends(get_db)
):
    results = db.query(
        Complaint.priority,
        func.count(Complaint.id).label("count")
    ).group_by(Complaint.priority).all()

    return [{"priority": r[0].value if r[0] else "unknown", "count": r[1]} for r in results]

@router.get("/trend")
async def get_trend(
    current_user: dict = Depends(require_role("analyst", "officer", "super_admin")),
    db: Session = Depends(get_db)
):
    """Monthly complaint trend (last 6 months)."""
    results = db.query(
        func.date_trunc('month', Complaint.created_at).label("month"),
        func.count(Complaint.id).label("count")
    ).group_by("month").order_by("month").limit(6).all()

    return [{"month": str(r[0])[:7], "count": r[1]} for r in results]
