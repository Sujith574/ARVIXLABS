from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_admin
from app.services.vector_service import vector_service
import google.generativeai as genai
import uuid, os, json

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

# ── Arvix AI helper ─────────────────────────────────────────────────────────────

async def _arvix_ai_chat(message: str) -> str:
    try:
        # 1. Search for context in FAISS
        contexts = await vector_service.search(message)
        context_text = "\n".join(contexts) if contexts else "No specific context found."
        
        # 2. Generate response with gemini-2.0-flash
        genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""), transport='rest')
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        prompt = (
            f"You are Arvix AI, a highly advanced intelligence engine. Your goal is to provide deep, technical, and extremely helpful answers directly. "
            f"Respond with the same clarity, depth, and directness as a world-class large language model.\n\n"
            f"CONTEXT:\n{context_text}\n\n"
            f"USER QUERY: {message}\n\n"
            f"ARVIX RESPONSE:"
        )
        
        response = model.generate_content(prompt, request_options={"timeout": 20.0})
        return response.text
    except Exception as e:
        print(f"AI Error: {e}")
        return (
            "Neural link instability detected. Arvix AI core is currently synchronizing with the global node. "
            "Please re-initialize your request or verify your administrative credentials."
        )

# ── Chat ───────────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatMessage):
    """Public AI chat endpoint — uses RAG + Arvix Intelligence Engine."""
    session_id = payload.session_id or str(uuid.uuid4())
    response = await _arvix_ai_chat(payload.message)
    return ChatResponse(response=response, session_id=session_id)

# ── Context Ingestion (Admin) ───────────────────────────────────────────────────

@router.post("/context")
async def add_context(payload: ContextIn, _=Depends(get_current_admin)):
    """Add raw text to the FAISS vector index."""
    try:
        await vector_service.add_context(payload.text, {"type": "manual_entry", "timestamp": str(uuid.uuid4())})
        return {"status": "success", "message": "Context vectorized and indexed in FAISS"}
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
    """Upload a CSV or JSON file — parse records, vectorize, and index."""
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

    # Vectorize each record
    for rec in records:
        text_content = json.dumps(rec)
        await vector_service.add_context(text_content, {"filename": file.filename, "source": source_type})

    # Save metadata for UI list
    cms_dir = os.path.join(os.path.dirname(__file__), "../../../../cms_data")
    os.makedirs(cms_dir, exist_ok=True)
    datasets_file = os.path.join(cms_dir, "datasets.json")
    existing = []
    if os.path.exists(datasets_file):
        try:
            existing = json.loads(open(datasets_file).read())
        except Exception: pass
        
    existing.append({
        "id": str(uuid.uuid4()),
        "filename": file.filename,
        "description": description,
        "source_type": source_type,
        "record_count": len(records),
        "status": "indexed"
    })
    with open(datasets_file, "w") as f:
        json.dump(existing, f, default=str, indent=2)

    return {
        "status": "success",
        "records_processed": len(records),
        "message": f"Dataset '{file.filename}' processed and indexed in FAISS."
    }

@router.get("/datasets")
async def list_datasets(_=Depends(get_current_admin)):
    import json
    datasets_file = os.path.join(os.path.dirname(__file__), "../../../../cms_data/datasets.json")
    if not os.path.exists(datasets_file):
        return []
    try:
        return json.loads(open(datasets_file).read())
    except Exception:
        return []
