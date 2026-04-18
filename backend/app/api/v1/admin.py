from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.models import User, Department, Category
from app.schemas.schemas import DepartmentCreate, DepartmentOut, CategoryCreate, CategoryOut, UserOut
from app.core.security import require_role
import uuid

router = APIRouter(prefix="/admin", tags=["Admin Panel"])

# ─── USERS ────────────────────────────────────────────────────────────────────
@router.get("/users", response_model=List[UserOut])
async def list_users(
    current_user: dict = Depends(require_role("admin", "super_admin")),
    db: Session = Depends(get_db)
):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: str,
    role: str,
    current_user: dict = Depends(require_role("admin", "super_admin")),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    return {"message": f"Role updated to {role}"}

@router.patch("/users/{user_id}/toggle")
async def toggle_user(
    user_id: str,
    current_user: dict = Depends(require_role("admin", "super_admin")),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": "User status updated", "is_active": user.is_active}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: dict = Depends(require_role("admin", "super_admin")),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}

# ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
@router.get("/departments", response_model=List[DepartmentOut])
async def list_departments(db: Session = Depends(get_db)):
    return db.query(Department).filter(Department.is_active == True).all()

@router.post("/departments", response_model=DepartmentOut, status_code=201)
async def create_department(
    payload: DepartmentCreate,
    current_user: dict = Depends(require_role("admin", "super_admin")),
    db: Session = Depends(get_db)
):
    dept = Department(id=str(uuid.uuid4()), **payload.dict())
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept

@router.put("/departments/{dept_id}", response_model=DepartmentOut)
async def update_department(
    dept_id: str,
    payload: DepartmentCreate,
    current_user: dict = Depends(require_role("admin", "super_admin")),
    db: Session = Depends(get_db)
):
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(dept, k, v)
    db.commit()
    db.refresh(dept)
    return dept

@router.delete("/departments/{dept_id}")
async def delete_department(
    dept_id: str,
    current_user: dict = Depends(require_role("admin", "super_admin")),
    db: Session = Depends(get_db)
):
    dept = db.query(Department).filter(Department.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    dept.is_active = False
    db.commit()
    return {"message": "Department deactivated"}

# ─── CATEGORIES ───────────────────────────────────────────────────────────────
@router.get("/categories", response_model=List[CategoryOut])
async def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).all()

@router.post("/categories", response_model=CategoryOut, status_code=201)
async def create_category(
    payload: CategoryCreate,
    current_user: dict = Depends(require_role("admin", "super_admin")),
    db: Session = Depends(get_db)
):
    cat = Category(id=str(uuid.uuid4()), **payload.dict())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/categories/{cat_id}")
async def delete_category(
    cat_id: str,
    current_user: dict = Depends(require_role("admin", "super_admin")),
    db: Session = Depends(get_db)
):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    cat.is_active = False
    db.commit()
    return {"message": "Category deactivated"}
