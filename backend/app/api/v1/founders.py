from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import TeamMember
from app.core.security import get_current_admin
from pydantic import BaseModel
from typing import Optional, List
import uuid

router = APIRouter(prefix="/founders", tags=["Founders & Team"])

class PersonBase(BaseModel):
    name: str
    role: str
    bio: Optional[str] = None
    image_url: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    twitter: Optional[str] = None
    type: str = "founder"  # "founder" | "developer" | "advisor"

class PersonOut(PersonBase):
    id: str

# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/", response_model=List[PersonOut])
async def get_team(db: Session = Depends(get_db)):
    team = db.query(TeamMember).all()
    if not team:
        # Initial seeding if empty
        seed_member = TeamMember(
            name="Sujit Kumar",
            role="Founder & CEO",
            bio="Visionary technologist driving AI-powered governance transformation.",
            image_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Sujit",
            linkedin="#",
            github="#",
            twitter="#",
            type="founder"
        )
        db.add(seed_member)
        db.commit()
        db.refresh(seed_member)
        return [seed_member]
    return team

@router.get("/founders", response_model=List[PersonOut])
async def get_founders(db: Session = Depends(get_db)):
    return db.query(TeamMember).filter(TeamMember.type == "founder").all()

@router.get("/developers", response_model=List[PersonOut])
async def get_developers(db: Session = Depends(get_db)):
    return db.query(TeamMember).filter(TeamMember.type == "developer").all()

@router.post("/", response_model=PersonOut, status_code=201)
async def add_person(
    payload: PersonBase,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    new_person = TeamMember(**payload.dict())
    db.add(new_person)
    db.commit()
    db.refresh(new_person)
    return new_person

@router.put("/{person_id}", response_model=PersonOut)
async def update_person(
    person_id: str,
    payload: PersonBase,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    person = db.query(TeamMember).filter(TeamMember.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Operative node not found in registry")
    
    for key, value in payload.dict().items():
        setattr(person, key, value)
    
    db.commit()
    db.refresh(person)
    return person

@router.delete("/{person_id}")
async def delete_person(
    person_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_admin)
):
    person = db.query(TeamMember).filter(TeamMember.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Operative node not found")
    
    db.delete(person)
    db.commit()
    return {"message": "Node deprovisioned from sovereign council"}
