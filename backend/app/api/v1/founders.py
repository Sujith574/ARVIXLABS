from fastapi import APIRouter, Depends, HTTPException
from app.core.security import require_role
from pydantic import BaseModel
from typing import Optional, List
import uuid, os

router = APIRouter(prefix="/founders", tags=["Founders & Team"])

# Firebase Firestore integration
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    if not firebase_admin._apps:
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID", ""),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL", ""),
            "token_uri": "https://accounts.google.com/o/oauth2/token",
        })
        firebase_admin.initialize_app(cred)
    db_firestore = firestore.client()
    FIRESTORE_AVAILABLE = True
except Exception:
    FIRESTORE_AVAILABLE = False
    db_firestore = None

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

# ── In-memory fallback ─────────────────────────────────────────────────────────
_mock_people: List[dict] = [
    {
        "id": "1", "name": "Sujit Kumar", "role": "Founder & CEO",
        "bio": "Visionary technologist driving AI-powered governance transformation.",
        "image_url": "", "linkedin": "#", "github": "#", "twitter": "#", "type": "founder"
    },
    {
        "id": "2", "name": "Dev Lead", "role": "Lead Engineer",
        "bio": "Full-stack engineer specializing in distributed AI systems.",
        "image_url": "", "linkedin": "#", "github": "#", "twitter": "#", "type": "developer"
    },
]

def _get_all():
    if FIRESTORE_AVAILABLE:
        docs = db_firestore.collection("team").stream()
        return [{"id": d.id, **d.to_dict()} for d in docs]
    return _mock_people

def _create(data: dict) -> dict:
    pid = str(uuid.uuid4())
    data["id"] = pid
    if FIRESTORE_AVAILABLE:
        db_firestore.collection("team").document(pid).set(data)
    else:
        _mock_people.append(data)
    return data

def _update(pid: str, data: dict):
    if FIRESTORE_AVAILABLE:
        db_firestore.collection("team").document(pid).update(data)
    else:
        for i, p in enumerate(_mock_people):
            if p["id"] == pid:
                _mock_people[i] = {**p, **data}
                return

def _delete(pid: str):
    if FIRESTORE_AVAILABLE:
        db_firestore.collection("team").document(pid).delete()
    else:
        global _mock_people
        _mock_people = [p for p in _mock_people if p["id"] != pid]

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
