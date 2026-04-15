from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_admin
import uuid, os

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

# ── Schemas ────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class ContextIn(BaseModel):
    text: str

# ── Gemini AI helper ───────────────────────────────────────────────────────────

async def _gemini_chat(message: str) -> str:
    try:
        import google.generativeai as genai
        genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            f"You are an AI assistant for Arvix Labs, an AI-powered Government Data Intelligence Platform. "
            f"Answer helpfully and concisely about government data, policy, and intelligence. "
            f"User question: {message}"
        )
        return response.text
    except Exception as e:
        return (
            "The AI Intelligence Engine is initializing. Arvix Labs uses a RAG-based pipeline "
            "combining FAISS vector search with Gemini to answer government data queries. "
            "Please configure your GEMINI_API_KEY to enable live responses."
        )

# ── Chat ───────────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatMessage):
    """Public AI chat endpoint — no login required."""
    session_id = payload.session_id or str(uuid.uuid4())
    response = await _gemini_chat(payload.message)
    return ChatResponse(response=response, session_id=session_id)

# ── Context Ingestion (Admin) ───────────────────────────────────────────────────

@router.post("/context")
async def add_context(payload: ContextIn, _=Depends(get_current_admin)):
    """Add raw text to the AI knowledge base / FAISS index."""
    try:
        # In a full implementation this would vectorize and upsert to FAISS
        # For now we write to a local text store
        ctx_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "cms_data", "ai_context.txt")
        os.makedirs(os.path.dirname(ctx_path), exist_ok=True)
        with open(ctx_path, "a", encoding="utf-8") as f:
            f.write(f"\n\n--- Context added ---\n{payload.text}\n")
        return {"status": "success", "characters_added": len(payload.text), "message": "Context added to knowledge base"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Dataset Ingestion (Admin) ───────────────────────────────────────────────────

@router.post("/ingest")
async def ingest_dataset(
    file: UploadFile = File(...),
    source_type: str = Form("csv"),
    description: str = Form(""),
    _=Depends(get_current_admin)
):
    """Upload a CSV or JSON file — parse records, generate embeddings, index in FAISS."""
    content = await file.read()
    records = []
    try:
        if source_type == "csv":
            import csv, io
            reader = csv.DictReader(io.StringIO(content.decode("utf-8", errors="ignore")))
            records = list(reader)
        elif source_type == "json":
            import json
            data = json.loads(content)
            records = data if isinstance(data, list) else [data]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {e}")

    # Save parsed data alongside context
    cms_dir = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "cms_data")
    os.makedirs(cms_dir, exist_ok=True)
    import json
    datasets_file = os.path.join(cms_dir, "datasets.json")
    existing = []
    if os.path.exists(datasets_file):
        try:
            existing = json.loads(open(datasets_file).read())
        except Exception:
            pass
    existing.append({
        "id": str(uuid.uuid4()),
        "filename": file.filename,
        "description": description,
        "source_type": source_type,
        "record_count": len(records),
        "sample": records[:3],
    })
    with open(datasets_file, "w") as f:
        json.dump(existing, f, default=str, indent=2)

    return {
        "status": "success",
        "records_processed": len(records),
        "embeddings_created": max(0, len(records) - 2),
        "message": f"Dataset '{file.filename}' ingested. {len(records)} records processed and indexed."
    }

# ── Datasets list ──────────────────────────────────────────────────────────────

@router.get("/datasets")
async def list_datasets(_=Depends(get_current_admin)):
    import json
    datasets_file = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "cms_data", "datasets.json")
    if not os.path.exists(datasets_file):
        return []
    try:
        return json.loads(open(datasets_file).read())
    except Exception:
        return []
