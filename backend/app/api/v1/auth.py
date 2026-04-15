from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import (
    create_access_token, verify_password, get_password_hash,
    ADMIN_USERNAME, ADMIN_PASSWORD, get_current_admin
)
from pydantic import BaseModel
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str = ADMIN_USERNAME

# ── Admin Login ────────────────────────────────────────────────────────────────
@router.post("/admin-login", response_model=AdminLoginResponse)
async def admin_login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Single admin login endpoint."""
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials",
        )
    token = create_access_token({"sub": "admin", "role": "admin"})
    return AdminLoginResponse(access_token=token, username=ADMIN_USERNAME)

@router.get("/admin/me")
async def admin_me(current=Depends(get_current_admin)):
    return {"username": ADMIN_USERNAME, "role": "admin"}

@router.post("/verify")
async def verify_token(current=Depends(get_current_admin)):
    return {"valid": True}
