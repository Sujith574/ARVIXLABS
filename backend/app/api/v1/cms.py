from fastapi import APIRouter, Depends, HTTPException
from app.core.security import require_admin
from pydantic import BaseModel
from typing import Optional, List, Any
import os, json
from pathlib import Path

router = APIRouter(prefix="/cms", tags=["CMS"])

# ── Firestore-backed with JSON file fallback ───────────────────────────────────
FALLBACK_DIR = Path(__file__).parent.parent.parent.parent / "cms_data"
FALLBACK_DIR.mkdir(exist_ok=True)

try:
    import firebase_admin
    from firebase_admin import firestore as _fs
    _db = _fs.client()
    FS = True
except Exception:
    _db = None
    FS = False

def _col(name: str):
    if FS:
        return _db.collection(name)
    return None

def _file(name: str) -> Path:
    return FALLBACK_DIR / f"{name}.json"

def _read(name: str) -> list:
    if FS:
        return [{"id": d.id, **d.to_dict()} for d in _col(name).stream()]
    f = _file(name)
    if f.exists():
        return json.loads(f.read_text())
    return []

def _write_all(name: str, data: list):
    if not FS:
        _file(name).write_text(json.dumps(data, default=str))

def _upsert(name: str, doc_id: str, data: dict):
    if FS:
        _col(name).document(doc_id).set(data, merge=True)
    else:
        existing = _read(name)
        found = False
        for i, item in enumerate(existing):
            if item.get("id") == doc_id:
                existing[i] = {"id": doc_id, **data}
                found = True
                break
        if not found:
            existing.append({"id": doc_id, **data})
        _write_all(name, existing)

def _delete_doc(name: str, doc_id: str):
    if FS:
        _col(name).document(doc_id).delete()
    else:
        existing = [x for x in _read(name) if x.get("id") != doc_id]
        _write_all(name, existing)

# ── Schemas ────────────────────────────────────────────────────────────────────

class SiteSettings(BaseModel):
    hero_title: Optional[str] = "AI-Powered Intelligence for Smarter Governance"
    hero_subtitle: Optional[str] = "Transforming government data into real-time insights and decisions"
    hero_cta_label: Optional[str] = "Try AI Assistant"
    hero_badge: Optional[str] = "AI-Powered Government Intelligence Platform"
    navbar_links: Optional[List[dict]] = None
    footer_tagline: Optional[str] = "© 2026 Arvix Labs. All rights reserved."
    contact_email: Optional[str] = ""
    platform_name: Optional[str] = "Arvix Labs"
    support_email: Optional[str] = "hello@arvixlabs.ai"
    theme: Optional[str] = "dark"

class Feature(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    icon: Optional[str] = "Zap"
    color: Optional[str] = "#3b82f6"
    order: Optional[int] = 0

class Solution(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    icon: Optional[str] = "Shield"
    color: Optional[str] = "#22d3ee"
    tags: Optional[List[str]] = []
    order: Optional[int] = 0

class Stat(BaseModel):
    id: Optional[str] = None
    label: str
    value: str
    icon: Optional[str] = "CheckCircle"

class Section(BaseModel):
    id: Optional[str] = None
    section_key: str  # e.g. "features_heading", "about_mission"
    title: Optional[str] = None
    subtitle: Optional[str] = None
    body: Optional[str] = None
    visible: bool = True

# ── Site Settings ──────────────────────────────────────────────────────────────

DEFAULT_SETTINGS = {
    "hero_title": "AI-Powered Intelligence for Smarter Governance",
    "hero_subtitle": "Transforming government data into real-time insights and decisions",
    "hero_cta_label": "Try AI Assistant",
    "hero_badge": "AI-Powered Government Intelligence Platform",
    "footer_tagline": "© 2026 Arvix Labs. All rights reserved.",
    "contact_email": "arvixlabs@gmail.com",
    "navbar_links": [
        {"label": "Home", "href": "/"},
        {"label": "Solutions", "href": "/#solutions"},
        {"label": "AI Insights", "href": "/#ai-demo"},
        {"label": "About", "href": "/about"},
        {"label": "Contact", "href": "/#contact"},
    ]
}

@router.get("/settings")
async def get_settings():
    data = _read("site_settings")
    return data[0] if data else DEFAULT_SETTINGS

@router.put("/settings")
async def update_settings(payload: SiteSettings, _=Depends(require_admin)):
    _upsert("site_settings", "main", payload.dict(exclude_none=True))
    return {"message": "Settings updated"}

# ── Features ───────────────────────────────────────────────────────────────────

DEFAULT_FEATURES = [
    {"id": "f1", "title": "AI Intelligence Engine", "description": "Powered by Arvix AI + RAG pipeline for semantic search, pattern detection, and automated government insights.", "icon": "Brain", "color": "#3b82f6", "order": 0},
    {"id": "f2", "title": "Data Analytics Dashboard", "description": "Interactive dashboards tracking real-time data trends, department metrics, and predictive intelligence.", "icon": "BarChart3", "color": "#22d3ee", "order": 1},
    {"id": "f3", "title": "Real-Time Insights", "description": "Live intelligence feeds with automated alerts, pattern recognition, and decision support outputs.", "icon": "Zap", "color": "#a78bfa", "order": 2},
    {"id": "f4", "title": "Scalable SaaS Architecture", "description": "Cloud-native FastAPI + Next.js platform containerized for Google Cloud Run with zero-downtime deployments.", "icon": "Globe", "color": "#10b981", "order": 3},
]

@router.get("/features")
async def get_features():
    data = _read("features")
    return data if data else DEFAULT_FEATURES

@router.post("/features", status_code=201)
async def create_feature(payload: Feature, _=Depends(require_admin)):
    import uuid
    fid = payload.id or str(uuid.uuid4())
    d = {**payload.dict(), "id": fid}
    _upsert("features", fid, d)
    return d

@router.put("/features/{fid}")
async def update_feature(fid: str, payload: Feature, _=Depends(require_admin)):
    _upsert("features", fid, payload.dict())
    return {"id": fid, **payload.dict()}

@router.delete("/features/{fid}")
async def delete_feature(fid: str, _=Depends(require_admin)):
    _delete_doc("features", fid)
    return {"message": "Deleted"}

# ── Solutions ──────────────────────────────────────────────────────────────────

DEFAULT_SOLUTIONS = [
    {"id": "s1", "title": "Public Grievance Intelligence", "description": "AI-powered citizen complaint analysis, automatic routing, and resolution tracking across all government departments.", "icon": "Users", "color": "#3b82f6", "tags": ["AI", "Governance", "Analytics"], "order": 0},
    {"id": "s2", "title": "Data Analysis Platform", "description": "Ingest, vectorize, and query any government dataset using FAISS semantic search and Arvix AI-powered summaries.", "icon": "Database", "color": "#10b981", "tags": ["FAISS", "RAG", "Data"], "order": 1},
    {"id": "s3", "title": "Decision Support System", "description": "Evidence-based intelligence reports generated from live data to support elected officials and administrators.", "icon": "Shield", "color": "#f59e0b", "tags": ["Reports", "Policy", "AI"], "order": 2},
]

@router.get("/solutions")
async def get_solutions():
    data = _read("solutions")
    return data if data else DEFAULT_SOLUTIONS

@router.post("/solutions", status_code=201)
async def create_solution(payload: Solution, _=Depends(require_admin)):
    import uuid
    sid = payload.id or str(uuid.uuid4())
    d = {**payload.dict(), "id": sid}
    _upsert("solutions", sid, d)
    return d

@router.put("/solutions/{sid}")
async def update_solution(sid: str, payload: Solution, _=Depends(require_admin)):
    _upsert("solutions", sid, payload.dict())
    return {"id": sid, **payload.dict()}

@router.delete("/solutions/{sid}")
async def delete_solution(sid: str, _=Depends(require_admin)):
    _delete_doc("solutions", sid)
    return {"message": "Deleted"}

# ── Stats ──────────────────────────────────────────────────────────────────────

DEFAULT_STATS = [
    {"id": "st1", "label": "Data Points Analysed", "value": "2.4M+", "icon": "Database"},
    {"id": "st2", "label": "AI Query Accuracy", "value": "98.7%", "icon": "Brain"},
    {"id": "st3", "label": "Govt. Departments", "value": "24+",   "icon": "Globe"},
    {"id": "st4", "label": "Avg. Insight Latency", "value": "<1s", "icon": "Zap"},
]

@router.get("/stats")
async def get_stats():
    data = _read("stats")
    return data if data else DEFAULT_STATS

@router.post("/stats", status_code=201)
async def create_stat(payload: Stat, _=Depends(require_admin)):
    import uuid
    sid = payload.id or str(uuid.uuid4())
    d = {**payload.dict(), "id": sid}
    _upsert("stats", sid, d)
    return d

@router.put("/stats/{sid}")
async def update_stat(sid: str, payload: Stat, _=Depends(require_admin)):
    _upsert("stats", sid, payload.dict())
    return {"id": sid, **payload.dict()}

@router.delete("/stats/{sid}")
async def delete_stat(sid: str, _=Depends(require_admin)):
    _delete_doc("stats", sid)
    return {"message": "Deleted"}

# ── Generic Sections ───────────────────────────────────────────────────────────

@router.get("/sections")
async def get_sections():
    return _read("sections")

@router.put("/sections/{section_key}")
async def upsert_section(section_key: str, payload: Section, _=Depends(require_admin)):
    _upsert("sections", section_key, payload.dict())
    return {"id": section_key, **payload.dict()}
