from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.models import Complaint, User, Department, Category
from app.core.security import require_role
from typing import List

router = APIRouter(prefix="/analytics", tags=["Analytics"])
 
@router.get("/public-overview")
async def get_public_overview(db: Session = Depends(get_db)):
    """Publicly available analytics overview."""
    total = db.query(Complaint).count()
    resolved = db.query(Complaint).filter(Complaint.status == "resolved").count()
    
    # Mock distribution for variety if DB is sparse
    if total == 0:
        return {
            "total": 0, "resolved": 0, "pending": 0, "in_progress": 0, "critical": 0,
            "resolution_rate": 0, "is_mock": False
        }

    return {
        "total": total,
        "resolved": resolved,
        "pending": db.query(Complaint).filter(Complaint.status == "submitted").count(),
        "in_progress": db.query(Complaint).filter(Complaint.status == "in_progress").count(),
        "critical": db.query(Complaint).filter(Complaint.priority == "critical").count(),
        "resolution_rate": round((resolved / total * 100) if total > 0 else 0, 1),
        "is_mock": False
    }

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

    # Format for frontend expects { priority: string, count: number }
    return [{"priority": (r[0].value if hasattr(r[0], 'value') else str(r[0])), "count": r[1]} for r in results]

@router.get("/trend")
async def get_trend(
    current_user: dict = Depends(require_role("analyst", "officer", "super_admin")),
    db: Session = Depends(get_db)
):
    """Monthly complaint trend (last 6 months). Supports SQLite and Postgres."""
    # SQLite fallback for grouping by month
    if "sqlite" in str(db.bind.url):
        results = db.query(
            func.strftime('%Y-%m', Complaint.created_at).label("month"),
            func.count(Complaint.id).label("count")
        ).group_by("month").order_by("month").limit(6).all()
    else:
        results = db.query(
            func.date_trunc('month', Complaint.created_at).label("month"),
            func.count(Complaint.id).label("count")
        ).group_by("month").order_by("month").limit(6).all()

    return [{"month": str(r[0]), "count": r[1]} for r in results]
