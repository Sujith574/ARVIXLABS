from fastapi import APIRouter, Depends, HTTPException
from app.core.security import require_role
from pydantic import BaseModel
from typing import Optional, List
import uuid, os
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/founders", tags=["Founders & Team"])

class PersonBase(BaseModel):
    name: str
    role: str
    bio: Optional[str] = None
    image_url: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    type: str = "founder"  # "founder" | "developer"

class PersonOut(PersonBase):
    id: str

# ── Firebase integration ────────────────────────────────────────────────────────

def _get_all():
    if firebase_service.db:
        docs = firebase_service.db.collection("team").stream()
        return [{"id": d.id, **d.to_dict()} for d in docs]
    return [
        {
            "id": "1", "name": "Sujit Kumar", "role": "Founder & CEO",
            "bio": "Visionary technologist driving AI-powered governance transformation.",
            "image_url": "", "linkedin": "#", "github": "#", "twitter": "#", "type": "founder"
        }
    ]

def _create(data: dict) -> dict:
    pid = str(uuid.uuid4())
    data["id"] = pid
    if firebase_service.db:
        firebase_service.db.collection("team").document(pid).set(data)
    return data

def _update(pid: str, data: dict):
    if firebase_service.db:
        firebase_service.db.collection("team").document(pid).update(data)

def _delete(pid: str):
    if firebase_service.db:
        firebase_service.db.collection("team").document(pid).delete()

# ── Routes ────────────────────────────────────────────────────────────────────
@router.get("/", response_model=List[PersonOut])
async def get_team():
    return _get_all()

@router.get("/founders", response_model=List[PersonOut])
async def get_founders():
    return [p for p in _get_all() if p.get("type") == "founder"]

@router.get("/developers", response_model=List[PersonOut])
async def get_developers():
    return [p for p in _get_all() if p.get("type") == "developer"]

@router.post("/", response_model=PersonOut, status_code=201)
async def add_person(
    payload: PersonBase,
    current_user: dict = Depends(require_role("super_admin"))
):
    return _create(payload.dict())

@router.put("/{person_id}", response_model=PersonOut)
async def update_person(
    person_id: str,
    payload: PersonBase,
    current_user: dict = Depends(require_role("super_admin"))
):
    _update(person_id, payload.dict())
    return {"id": person_id, **payload.dict()}

@router.delete("/{person_id}")
async def delete_person(
    person_id: str,
    current_user: dict = Depends(require_role("super_admin"))
):
    _delete(person_id)
    return {"message": "Deleted"}
