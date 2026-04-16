from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid, os
from app.core.security import get_current_admin
from app.services.mail_service import mail_service
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/contact", tags=["Contact"])

class ContactIn(BaseModel):
    name: str
    email: str
    subject: Optional[str] = "General Inquiry"
    message: str

# ── Firebase Logic ────────────────────────────────────────────────────────────

@router.post("/", status_code=201)
async def submit_message(payload: ContactIn):
    pid = str(uuid.uuid4())
    item = {
        "id": pid,
        **payload.model_dump(),
        "read": False,
        "created_at": datetime.utcnow().isoformat(),
    }
    if firebase_service.db:
        firebase_service.db.collection("contacts").document(pid).set(item)
    
    # Notify via Email
    mail_service.send_notification(
        subject=f"New Contact: {payload.subject}",
        body=f"Name: {payload.name}\nEmail: {payload.email}\nMessage: {payload.message}"
    )
    
    return {"status": "received", "message": "Thanks! We'll get back to you soon."}

@router.get("/admin/all")
async def list_messages(_=Depends(get_current_admin)):
    if firebase_service.db:
        docs = firebase_service.db.collection("contacts").stream()
        return sorted([doc.to_dict() for doc in docs], key=lambda x: x.get("created_at", ""), reverse=True)
    return []

@router.patch("/admin/{msg_id}/read")
async def mark_read(msg_id: str, _=Depends(get_current_admin)):
    if firebase_service.db:
        firebase_service.db.collection("contacts").document(msg_id).update({"read": True})
    return {"status": "marked as read"}

@router.delete("/admin/{msg_id}")
async def delete_message(msg_id: str, _=Depends(get_current_admin)):
    if firebase_service.db:
        firebase_service.db.collection("contacts").document(msg_id).delete()
    return {"status": "deleted"}
