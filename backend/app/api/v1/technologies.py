from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid, os
from app.core.security import get_current_admin
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/technologies", tags=["Technologies"])

class TechIn(BaseModel):
    title: str
    description: str
    use_case: Optional[str] = ""
    status: Optional[str] = "Prototype"
    image_url: Optional[str] = ""
    category: Optional[str] = "Technology"

class TechOut(TechIn):
    id: str
    created_at: str

# ── Firebase Logic ────────────────────────────────────────────────────────────

def _get_all():
    if firebase_service.db:
        docs = firebase_service.db.collection("technologies").stream()
        return [{"id": d.id, **d.to_dict()} for d in docs]
    return [
        {
            "id": "1", "title": "Arvix AI", "description": "Context-aware government intelligence engine.",
            "use_case": "Real-time policy Q&A", "status": "Production", "category": "AI",
            "created_at": datetime.utcnow().isoformat()
        }
    ]

@router.get("/")
async def list_technologies():
    return _get_all()

@router.post("/", status_code=201)
async def create_technology(payload: TechIn, _=Depends(get_current_admin)):
    pid = str(uuid.uuid4())
    item = {"id": pid, **payload.model_dump(), "created_at": datetime.utcnow().isoformat()}
    if firebase_service.db:
        firebase_service.db.collection("technologies").document(pid).set(item)
    return item

@router.put("/{tech_id}")
async def update_technology(tech_id: str, payload: TechIn, _=Depends(get_current_admin)):
    if firebase_service.db:
        firebase_service.db.collection("technologies").document(tech_id).update(payload.model_dump())
    return {"id": tech_id, **payload.model_dump()}

@router.delete("/{tech_id}")
async def delete_technology(tech_id: str, _=Depends(get_current_admin)):
    if firebase_service.db:
        firebase_service.db.collection("technologies").document(tech_id).delete()
    return {"status": "deleted"}
