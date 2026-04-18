from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import create_access_token, ADMIN_USERNAME, get_current_admin
from app.db.database import get_db, AdminOTP, ApprovedAdmin
from app.core.config import settings
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import random
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter(prefix="/auth", tags=["Auth"])

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class AdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str = ADMIN_USERNAME
    role: str = "admin"
    name: str = "Arvix Admin"

# Password-less / OTP-only architecture implemented for production grade security.
# Admin logins are routed through /request-otp and /verify-otp protocols.

# ── OTP Logic ──────────────────────────────────────────────────────────────────
def send_otp_email(target_email: str, otp: str):
    message = MIMEMultipart("alternative")
    message["Subject"] = "Arvix Labs — Admin OTP Access Control"
    message["From"] = settings.MAIL_FROM
    message["To"] = target_email

    html = f"""
    <html>
    <body style="font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 40px;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
            <div style="color: #0A2A66; font-size: 24px; font-weight: 900; margin-bottom: 20px;">ARVIX LABS</div>
            <p style="color: #64748b; font-size: 16px; margin-bottom: 30px;">Initialize administrative access with the following one-time passcode:</p>
            <div style="background: #f1f5f9; padding: 20px; text-align: center; border-radius: 16px; font-size: 32px; font-weight: 900; letter-spacing: 12px; color: #3b82f6; border: 1px solid #e2e8f0;">
                {otp}
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 30px; line-height: 1.6;">
                This code expires in 5 minutes. If you did not request this, please secure your administrative records immediately.
            </p>
        </div>
    </body>
    </html>
    """
    message.attach(MIMEText(html, "html"))
    
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(settings.MAIL_SERVER, settings.MAIL_PORT, context=context) as server:
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.sendmail(settings.MAIL_FROM, target_email, message.as_string())

@router.post("/request-otp")
async def request_otp(data: OTPRequest, db: Session = Depends(get_db)):
    # Verify if identity exists in approved registry
    admin_node = db.query(ApprovedAdmin).filter(ApprovedAdmin.email == data.email).first()
    if not admin_node and data.email != "arvixlabs@gmail.com":
        raise HTTPException(status_code=403, detail="Identity not registered in Arvix Oversight Hub")
    
    import secrets
    otp_code = str(secrets.randbelow(900000) + 100000)  # Random 6-digit OTP
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Cycle existing tokens
    db.query(AdminOTP).filter(AdminOTP.email == data.email).update({AdminOTP.is_active: False})
    
    new_otp = AdminOTP(email=data.email, otp_code=otp_code, expires_at=expires_at)
    db.add(new_otp)
    db.commit()
    
    print(f"[AUTH] Security protocol initialized for {data.email}: {otp_code}")
    # ── Security Protocol Key Dispatch ──
    try:
        from app.services.mail_service import mail_service
        
        # High-fidelity Security Template
        html_code = f"""
        <div style="font-family: 'Inter', sans-serif; background: #020617; padding: 40px; border-radius: 24px;">
            <div style="max-width: 500px; margin: auto; background: #0f172a; border: 1px solid rgba(59,130,246,0.2); padding: 48px; border-radius: 32px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin-bottom: 8px;">Security Protocol</h1>
                <p style="color: #64748b; font-size: 14px; margin-bottom: 40px;">Neural Oversight Handshake</p>
                
                <div style="background: rgba(59,130,246,0.1); border: 1px dashed #3b82f6; border-radius: 24px; padding: 32px; margin-bottom: 40px;">
                    <p style="color: #3b82f6; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; margin-top:0;">Your Access Token</p>
                    <div style="color: #ffffff; font-size: 48px; font-weight: 900; letter-spacing: 8px; font-family: monospace;">{otp_code}</div>
                </div>
                
                <p style="color: #94a3b8; font-size: 13px; line-height: 1.6;">
                    If you did not initiate this handshake, please ignore this dispatch. This token expires in 600 seconds.
                </p>
            </div>
        </div>
        """
        
        success = mail_service.send_notification(
            subject="Security Protocol Key",
            body=html_code, # Mail service now supports HTML
            to_emails=[data.email]
        )
        if not success:
            raise HTTPException(status_code=500, detail="Failed to dispatch security protocol email")
    except Exception as e:
        print(f"[AUTH] OTP Dispatch Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to dispatch security protocol email")

@router.post("/verify-otp", response_model=AdminLoginResponse)
async def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    otp_record = db.query(AdminOTP).filter(
        AdminOTP.email == data.email,
        AdminOTP.otp_code == data.otp,
        AdminOTP.is_active == True,
        AdminOTP.expires_at > datetime.utcnow()
    ).first()
    
    if not otp_record:
        raise HTTPException(status_code=401, detail="Invalid or expired security code")
    
    otp_record.is_active = False
    db.commit()

    # Determine identity attributes
    admin_node = db.query(ApprovedAdmin).filter(ApprovedAdmin.email == data.email).first()
    is_super = data.email == "arvixlabs@gmail.com"
    role = "super_admin" if is_super else (admin_node.role if admin_node else "admin")
    
    token = create_access_token({"sub": data.email, "role": role})
    return AdminLoginResponse(
        access_token=token, 
        username=data.email,
        role=role,
        name="Arvix Supervisor" if is_super else "Authorized Officer"
    )

@router.get("/admin/me")
async def admin_me(current=Depends(get_current_admin)):
    return {"username": "Arvix Admin", "role": "admin"}

@router.post("/verify")
async def verify_token(current=Depends(get_current_admin)):
    return {"valid": True}

# ── Admin Management ───────────────────────────────────────────────────────────

class AdminEmail(BaseModel):
    email: EmailStr
    role: str = "admin"

@router.get("/admins", response_model=List[dict])
async def list_admins(db: Session = Depends(get_db), current=Depends(get_current_admin)):
    admins = db.query(ApprovedAdmin).all()
    return [{"id": a.id, "email": a.email, "role": a.role, "added_at": a.added_at} for a in admins]

@router.post("/admins")
async def add_admin(data: AdminEmail, db: Session = Depends(get_db), current=Depends(get_current_admin)):
    # Super-admin check
    if current.get("sub") != "arvixlabs@gmail.com":
        raise HTTPException(status_code=403, detail="Super-administrative elevation required for identity provisioning")

    existing = db.query(ApprovedAdmin).filter(ApprovedAdmin.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Admin already registered")
    
    new_admin = ApprovedAdmin(email=data.email, role=data.role)
    db.add(new_admin)
    db.commit()
    return {"message": f"Identified {data.email} as authorized {data.role}"}

@router.patch("/admins/{admin_id}/role")
async def update_admin_role(admin_id: int, role: str, db: Session = Depends(get_db), current=Depends(get_current_admin)):
    # Super-admin check
    if current.get("sub") != "arvixlabs@gmail.com":
        raise HTTPException(status_code=403, detail="Super-administrative elevation required for role modification")

    admin = db.query(ApprovedAdmin).filter(ApprovedAdmin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin record node not found")
    
    admin.role = role
    db.commit()
    return {"message": "Administrative role updated"}

@router.delete("/admins/{admin_id}")
async def remove_admin(admin_id: int, db: Session = Depends(get_db), current=Depends(get_current_admin)):
    # Super-admin check
    if current.get("sub") != "arvixlabs@gmail.com":
        raise HTTPException(status_code=403, detail="Super-administrative elevation required for node deprovisioning")

    admin = db.query(ApprovedAdmin).filter(ApprovedAdmin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin record node not found")
    
    if admin.email == "arvixlabs@gmail.com":
         raise HTTPException(status_code=403, detail="Super-admin node persistence required")

    db.delete(admin)
    db.commit()
    return {"message": "Administrative node deprovisioned"}
