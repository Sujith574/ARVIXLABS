from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from app.core.security import require_admin
from pydantic import BaseModel
from typing import Optional, List
import os, uuid
from app.services.firebase_service import firebase_service

router = APIRouter(prefix="/media", tags=["Media"])

class MediaItem(BaseModel):
    id: str
    filename: str
    url: str
    content_type: str
    category: Optional[str] = "general"

@router.post("/upload", response_model=MediaItem, status_code=201)
async def upload_file(
    file: UploadFile = File(...),
    category: str = "general",
    _=Depends(require_admin)
):
    fid = str(uuid.uuid4())
    content = await file.read()

    try:
        url = firebase_service.upload_file(content, file.filename, file.content_type)
        if not url:
            raise Exception("Firebase upload returned no URL")
    except Exception as e:
        # local fallback
        url = f"/dev-media/{fid}_{file.filename}"

    return MediaItem(
        id=fid,
        filename=file.filename,
        url=url,
        content_type=file.content_type or "application/octet-stream",
        category=category
    )

@router.get("/list")
async def list_files(
    category: Optional[str] = None,
    _=Depends(require_admin)
):
    if firebase_service.bucket:
        try:
            prefix = f"grievances/" if not category else f"grievances/{category}/"
            blobs = list(firebase_service.bucket.list_blobs(prefix=prefix))
            return [
                {"filename": b.name.split("/")[-1], "url": b.public_url, "category": category or "all"}
                for b in blobs
            ]
        except Exception:
            pass
    return []
