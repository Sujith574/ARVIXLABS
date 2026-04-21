"""
Public Grievance API — AI-powered with SQLAlchemy backend.
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import uuid, json, os, random, string
from sqlalchemy.orm import Session
from app.db.database import get_db, ComplaintStatus, Priority
from app.models.models import Complaint, User, Department, Category
from app.core.security import get_current_admin

router = APIRouter(prefix="/grievances", tags=["Grievances"])

# ── Helpers ────────────────────────────────────────────────────────────────────

def _ticket_id() -> str:
    return "ALX-" + "".join(random.choices(string.digits, k=6))

async def _classify(title: str, description: str) -> dict:
    """Try Arvix AI classification; fall back to rule-based."""
    text = f"{title}. {description}"
    import asyncio
    try:
        import google.generativeai as genai, os
        from app.core.config import settings
        
        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        if api_key:
            genai.configure(api_key=api_key, transport='rest')
            model = genai.GenerativeModel("gemini-2.0-flash")
            prompt = (
                "You are an expert government grievance classifier. "
                "Internalize this grievance and reply with JSON ONLY.\n"
                "Fields: category (Roads/Water/Electricity/Healthcare/Education/Other), "
                "priority (low/medium/high/critical), department (Public Works/Water Board/etc), "
                "summary (1 sentence).\n\nGrievance: " + text
            )
            
            # Wrap in executor to handle potential library blocking or network hangs
            loop = asyncio.get_event_loop()
            r = await asyncio.wait_for(
                loop.run_in_executor(None, lambda: model.generate_content(prompt)),
                timeout=12.0
            )
            
            import re
            match = re.search(r'\{.*?\}', r.text, re.DOTALL)
            if match:
                return json.loads(match.group())
    except asyncio.TimeoutError:
        print(f"[GRIEVANCE] AI Classification timed out for: {title[:50]}...")
    except Exception as e:
        print(f"[GRIEVANCE] AI Classification error: {e}")
        pass
    
    # Rule-based fallback
    cats = {"road": "Roads", "water": "Water", "electric": "Electricity",
            "hospital": "Healthcare", "school": "Education"}
    cat = next((v for k, v in cats.items() if k in text.lower()), "Other")
    return {
        "category": cat,
        "priority": "medium",
        "department": "General Affairs",
        "summary": title[:120]
    }

from app.services.mail_service import mail_service

# ── Schemas ────────────────────────────────────────────────────────────────────

class GrievanceIn(BaseModel):
    title: str
    description: str
    submitter_name: Optional[str] = "Anonymous"
    submitter_email: Optional[str] = None

class StatusUpdate(BaseModel):
    status: ComplaintStatus
    remarks: Optional[str] = None
    note: Optional[str] = None # alias for remarks if needed

# ── PUBLIC endpoints ───────────────────────────────────────────────────────────

@router.post("/submit", status_code=201)
async def submit_grievance(payload: GrievanceIn, db: Session = Depends(get_db)):
    """Public — no login required. Uses AI for classification."""
    print(f"[GRIEVANCE] New submission request: {payload.title}")
    
    try:
        ai_data = await _classify(payload.title, payload.description)
    except Exception as e:
        print(f"[GRIEVANCE] AI Classification critical failure: {e}")
        ai_data = {"category": "Other", "priority": "medium", "summary": payload.title}

    # Map AI priority string to Enum
    priority_map = {
        "low": Priority.low,
        "medium": Priority.medium,
        "high": Priority.high,
        "critical": Priority.critical
    }
    db_priority = priority_map.get(str(ai_data.get("priority", "medium")).lower(), Priority.medium)

    try:
        new_complaint = Complaint(
            id=str(uuid.uuid4()),
            ticket_id=_ticket_id(),
            title=payload.title,
            description=payload.description,
            submitter_name=payload.submitter_name,
            submitter_email=payload.submitter_email,
            status=ComplaintStatus.submitted,
            priority=db_priority,
            ai_category=ai_data.get("category", "Other"),
            ai_priority=ai_data.get("priority", "medium"),
            ai_summary=ai_data.get("summary", ""),
            sla_deadline=datetime.utcnow() + timedelta(days=3)
        )
        
        db.add(new_complaint)
        db.commit()
        db.refresh(new_complaint)
        print(f"[GRIEVANCE] Successfully created ticket: {new_complaint.ticket_id} (ID: {new_complaint.id})")

        # Notify via Email
        try:
            from app.services.mail_service import mail_service
            # 1. Internal Alert (to Arvix Team)
            mail_service.send_notification(
                subject=f"New Grievance: {new_complaint.ticket_id}",
                body=(
                    f"Ticket: {new_complaint.ticket_id}\n"
                    f"Title: {new_complaint.title}\n"
                    f"Category (AI): {new_complaint.ai_category}\n"
                    f"Priority (AI): {new_complaint.ai_priority}\n\n"
                    f"Description: {new_complaint.description}"
                )
            )
            
            # 2. External Confirmation (to Citizen - Attractive Template)
            if payload.submitter_email:
                mail_service.send_ticket_confirmation(
                    to_email=payload.submitter_email,
                    ticket_id=new_complaint.ticket_id,
                    title=new_complaint.title
                )
        except Exception as mail_err:
            print(f"[GRIEVANCE] Email notification failed (non-critical): {mail_err}")

        return new_complaint

    except Exception as db_err:
        db.rollback()
        import traceback
        error_details = traceback.format_exc()
        print(f"[GRIEVANCE] Database transaction critical failure for ticket {payload.title}:")
        print(error_details)
        raise HTTPException(
            status_code=500, 
            detail=f"Grievance submission failed at the database layer. Error: {str(db_err)}"
        )

@router.get("/track/{ticket_id}")
async def track_grievance(ticket_id: str, db: Session = Depends(get_db)):
    """Public ticket tracker."""
    item = db.query(Complaint).filter(Complaint.ticket_id == ticket_id.upper()).first()
    if not item:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return item

# ── ADMIN endpoints ────────────────────────────────────────────────────────────

@router.get("/admin/all")
async def list_all(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Complaint).order_by(Complaint.created_at.desc()).all()

@router.get("/admin/{grievance_id}")
async def get_grievance_detail(grievance_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    item = db.query(Complaint).filter(Complaint.id == grievance_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Grievance not found")
    return item

@router.patch("/admin/{grievance_id}/status")
async def update_status(grievance_id: int, payload: StatusUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    item = db.query(Complaint).filter(Complaint.id == grievance_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Grievance not found")
    
    item.status = payload.status
    if payload.remarks:
        item.remarks = payload.remarks
    elif payload.note:
        item.remarks = payload.note
        
    if payload.status == ComplaintStatus.resolved:
        item.resolved_at = datetime.utcnow()
    
    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item

@router.delete("/admin/{grievance_id}")
async def delete_grievance(grievance_id: str, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    item = db.query(Complaint).filter(Complaint.id == grievance_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    
    db.delete(item)
    db.commit()
    return {"status": "deleted"}
