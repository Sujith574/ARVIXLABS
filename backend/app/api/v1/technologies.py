"""
Technologies showcase — CMS-driven, admin CRUD, public read.
Stored in cms_data/technologies.json (Firestore when available).
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid, json, os
from app.core.security import get_current_admin

router = APIRouter(prefix="/technologies", tags=["Technologies"])

DATA_FILE = os.path.join(os.path.dirname(__file__), "../../../../cms_data/technologies.json")

def _load() -> List[dict]:
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    if os.path.exists(DATA_FILE):
        try:
            return json.loads(open(DATA_FILE).read())
        except Exception:
            pass
    # Seed defaults on first run
    return [
        {
            "id": "1", "title": "Arvix AI", "description": "Context-aware government intelligence engine powered by Gemini and FAISS RAG pipeline.",
            "use_case": "Real-time policy Q&A, data summarization, and citizen query resolution.",
            "status": "Production", "image_url": "", "category": "AI",
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "id": "2", "title": "Grievance Intelligence", "description": "Auto-classifies, prioritizes and routes citizen complaints using AI.",
            "use_case": "Government departments, municipalities, civic bodies.",
            "status": "Production", "image_url": "", "category": "Platform",
            "created_at": datetime.utcnow().isoformat()
        },
        {
            "id": "3", "title": "Data Analytics Suite", "description": "Real-time dashboards and trend analysis for government data.",
            "use_case": "Department performance tracking, public transparency reporting.",
            "status": "Beta", "image_url": "", "category": "Analytics",
            "created_at": datetime.utcnow().isoformat()
        },
    ]

def _save(data: List[dict]):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, default=str, indent=2)

class TechIn(BaseModel):
    title: str
    description: str
    use_case: Optional[str] = ""
    status: Optional[str] = "Prototype"  # Prototype | Beta | Production
    image_url: Optional[str] = ""
    category: Optional[str] = "Technology"

# ── PUBLIC ─────────────────────────────────────────────────────────────────────

@router.get("/")
async def list_technologies():
    return _load()

@router.get("/{tech_id}")
async def get_technology(tech_id: str):
    data = _load()
    item = next((t for t in data if t["id"] == tech_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Technology not found")
    return item

# ── ADMIN ──────────────────────────────────────────────────────────────────────

@router.post("/", status_code=201)
async def create_technology(payload: TechIn, _=Depends(get_current_admin)):
    data = _load()
    item = {"id": str(uuid.uuid4()), **payload.model_dump(), "created_at": datetime.utcnow().isoformat()}
    data.append(item)
    _save(data)
    return item

@router.put("/{tech_id}")
async def update_technology(tech_id: str, payload: TechIn, _=Depends(get_current_admin)):
    data = _load()
    idx = next((i for i, t in enumerate(data) if t["id"] == tech_id), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Not found")
    data[idx] = {**data[idx], **payload.model_dump(), "updated_at": datetime.utcnow().isoformat()}
    _save(data)
    return data[idx]

@router.delete("/{tech_id}")
async def delete_technology(tech_id: str, _=Depends(get_current_admin)):
    data = _load()
    before = len(data)
    data = [t for t in data if t["id"] != tech_id]
    if len(data) == before:
        raise HTTPException(status_code=404, detail="Not found")
    _save(data)
    return {"status": "deleted"}
