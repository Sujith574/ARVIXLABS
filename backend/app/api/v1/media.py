from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from app.core.security import require_admin
from pydantic import BaseModel
from typing import Optional, List
import os, uuid

router = APIRouter(prefix="/media", tags=["Media"])

# Firebase Storage
try:
    from firebase_admin import storage as fb_storage
    STORAGE_AVAILABLE = True
except Exception:
    STORAGE_AVAILABLE = False

BUCKET = os.getenv("FIREBASE_STORAGE_BUCKET", "")

class MediaItem(BaseModel):
    id: str
    filename: str
    url: str
    content_type: str
    category: Optional[str] = "general"  # "team", "solutions", "general"


@router.post("/upload", response_model=MediaItem, status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    category: str = "general",
    _=Depends(require_admin)
):
    fid = str(uuid.uuid4())
    filename = f"{fid}_{file.filename}"
    content = await file.read()

    if STORAGE_AVAILABLE and BUCKET:
        try:
            bucket = fb_storage.bucket(BUCKET)
            blob = bucket.blob(f"arvixlabs/{category}/{filename}")
            blob.upload_from_string(content, content_type=file.content_type)
            blob.make_public()
            url = blob.public_url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Firebase upload failed: {e}")
    else:
        # Local fallback — save to /tmp for dev
        import tempfile
        save_path = os.path.join(tempfile.gettempdir(), filename)
        with open(save_path, "wb") as f:
            f.write(content)
        url = f"/dev-media/{filename}"

    return MediaItem(
        id=fid,
        filename=filename,
        url=url,
        content_type=file.content_type or "application/octet-stream",
        category=category
    )


@router.get("/list")
async def list_files(
    category: Optional[str] = None,
    _=Depends(require_admin)
):
    if STORAGE_AVAILABLE and BUCKET:
        try:
            bucket = fb_storage.bucket(BUCKET)
            prefix = f"arvixlabs/{category}/" if category else "arvixlabs/"
            blobs = list(bucket.list_blobs(prefix=prefix))
            return [
                {"filename": b.name.split("/")[-1], "url": b.public_url, "category": category or "all"}
                for b in blobs
            ]
        except Exception:
            pass
    return []
