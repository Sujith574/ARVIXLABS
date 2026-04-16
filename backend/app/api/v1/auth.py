from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import create_access_token, ADMIN_USERNAME, get_current_admin
from app.db.database import get_db, AdminOTP
from app.core.config import settings
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
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
    # Only allow the official admin email
    if data.email != settings.MAIL_FROM:
        raise HTTPException(status_code=403, detail="Unauthorized administrative identity")
    
    otp_code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Deactivate existing OTPs for this email
    db.query(AdminOTP).filter(AdminOTP.email == data.email).update({AdminOTP.is_active: False})
    
    new_otp = AdminOTP(email=data.email, otp_code=otp_code, expires_at=expires_at)
    db.add(new_otp)
    db.commit()
    
    print(f"[AUTH] Security protocol initialized. OTP for {data.email}: {otp_code}")
    
    try:
        send_otp_email(data.email, otp_code)
        return {"message": "OTP sent successfully"}
    except Exception as e:
        print(f"[AUTH] Email failure: {e}")
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
    
    # Consume OTP
    otp_record.is_active = False
    db.commit()
    
    token = create_access_token({"sub": "admin", "role": "admin"})
    return AdminLoginResponse(access_token=token, username="Arvix Admin")

@router.get("/admin/me")
async def admin_me(current=Depends(get_current_admin)):
    return {"username": "Arvix Admin", "role": "admin"}

@router.post("/verify")
async def verify_token(current=Depends(get_current_admin)):
    return {"valid": True}
