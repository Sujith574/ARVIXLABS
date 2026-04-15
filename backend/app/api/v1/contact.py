"""
Contact messages — public submit, admin view/delete.
Stored in cms_data/contacts.json.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid, json, os
from app.core.security import get_current_admin

router = APIRouter(prefix="/contact", tags=["Contact"])

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../../../cms_data/contacts.json")

def _load() -> List[dict]:
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    if os.path.exists(DATA_FILE):
        try:
            return json.loads(open(DATA_FILE).read())
        except Exception:
            pass
    return []

def _save(data: List[dict]):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, default=str, indent=2)

class ContactIn(BaseModel):
    name: str
    email: str
    subject: Optional[str] = "General Inquiry"
    message: str

# ── PUBLIC ─────────────────────────────────────────────────────────────────────

@router.post("/", status_code=201)
async def submit_message(payload: ContactIn):
    item = {
        "id": str(uuid.uuid4()),
        "name": payload.name,
        "email": payload.email,
        "subject": payload.subject,
        "message": payload.message,
        "read": False,
        "created_at": datetime.utcnow().isoformat(),
    }
    data = _load()
    data.append(item)
    _save(data)
    return {"status": "received", "message": "Thanks for reaching out! We'll get back to you soon."}

# ── ADMIN ──────────────────────────────────────────────────────────────────────

@router.get("/admin/all")
async def list_messages(_=Depends(get_current_admin)):
    data = _load()
    return sorted(data, key=lambda x: x.get("created_at", ""), reverse=True)

@router.patch("/admin/{msg_id}/read")
async def mark_read(msg_id: str, _=Depends(get_current_admin)):
    data = _load()
    item = next((m for m in data if m["id"] == msg_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Message not found")
    item["read"] = True
    _save(data)
    return item

@router.delete("/admin/{msg_id}")
async def delete_message(msg_id: str, _=Depends(get_current_admin)):
    data = _load()
    before = len(data)
    data = [m for m in data if m["id"] != msg_id]
    if len(data) == before:
        raise HTTPException(status_code=404, detail="Not found")
    _save(data)
    return {"status": "deleted"}
