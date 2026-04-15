"""
Public Grievance API — no auth required to submit or track.
Admin-protected routes for listing and status updates.
Data stored in local JSON (works without PostgreSQL).
When PostgreSQL is connected, swap to DB calls.
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid, json, os, random, string
from app.core.security import get_current_admin

router = APIRouter(prefix="/grievances", tags=["Grievances"])

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../../../cms_data/grievances.json")

# ── Helpers ────────────────────────────────────────────────────────────────────

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

def _ticket_id() -> str:
    return "ALX-" + "".join(random.choices(string.digits, k=6))

async def _classify(title: str, description: str) -> dict:
    """Try Gemini classification; fall back to rule-based."""
    text = f"{title}. {description}"
    try:
        import google.generativeai as genai, os
        genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            "Classify this government grievance and reply with JSON only.\n"
            "Fields: category (Roads/Water/Electricity/Healthcare/Education/Other), "
            "priority (low/medium/high/critical), department (Public Works/Water Board/etc), "
            "summary (1 sentence).\n\nGrievance: " + text
        )
        r = model.generate_content(prompt)
        import re
        match = re.search(r'\{.*?\}', r.text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
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

# ── Schemas ────────────────────────────────────────────────────────────────────

class GrievanceIn(BaseModel):
    title: str
    description: str
    submitter_name: Optional[str] = "Anonymous"
    submitter_email: Optional[str] = None
    category_id: Optional[str] = None

class StatusUpdate(BaseModel):
    status: str
    note: Optional[str] = None

# ── PUBLIC endpoints ───────────────────────────────────────────────────────────

@router.post("/submit", status_code=201)
async def submit_grievance(payload: GrievanceIn):
    """Public — no login required."""
    ai = await _classify(payload.title, payload.description)
    item = {
        "id": str(uuid.uuid4()),
        "ticket_id": _ticket_id(),
        "title": payload.title,
        "description": payload.description,
        "submitter_name": payload.submitter_name,
        "submitter_email": payload.submitter_email,
        "status": "submitted",
        "ai_category": ai.get("category", "Other"),
        "ai_priority": ai.get("priority", "medium"),
        "ai_department": ai.get("department", "General"),
        "ai_summary": ai.get("summary", ""),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    data = _load()
    data.append(item)
    _save(data)
    return item

@router.get("/track/{ticket_id}")
async def track_grievance(ticket_id: str):
    """Public ticket tracker."""
    data = _load()
    item = next((g for g in data if g["ticket_id"].upper() == ticket_id.upper()), None)
    if not item:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return item

# ── ADMIN endpoints ────────────────────────────────────────────────────────────

@router.get("/admin/all")
async def list_all(_=Depends(get_current_admin)):
    data = _load()
    return sorted(data, key=lambda x: x.get("created_at", ""), reverse=True)

@router.patch("/admin/{grievance_id}/status")
async def update_status(grievance_id: str, payload: StatusUpdate, _=Depends(get_current_admin)):
    data = _load()
    item = next((g for g in data if g["id"] == grievance_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Grievance not found")
    item["status"] = payload.status
    if payload.note:
        item["admin_note"] = payload.note
    item["updated_at"] = datetime.utcnow().isoformat()
    _save(data)
    return item

@router.delete("/admin/{grievance_id}")
async def delete_grievance(grievance_id: str, _=Depends(get_current_admin)):
    data = _load()
    before = len(data)
    data = [g for g in data if g["id"] != grievance_id]
    if len(data) == before:
        raise HTTPException(status_code=404, detail="Not found")
    _save(data)
    return {"status": "deleted"}
