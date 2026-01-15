from __future__ import annotations
import shutil
from fastapi import APIRouter
from ...core.config import settings
from ...db import reset_db

router = APIRouter()

@router.post("/demo/reset")
def reset_demo():
    reset_db()
    if settings.UPLOAD_DIR.exists():
        shutil.rmtree(settings.UPLOAD_DIR)
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    return {"ok": True}
