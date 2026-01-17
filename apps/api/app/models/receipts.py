from __future__ import annotations

from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from datetime import datetime, timezone
from uuid import uuid4

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class Receipt(Document):
    id: str = Field(default_factory=lambda: str(uuid4()))

    original_image_path: str
    preprocessed_image_path: str
    image_sha256: str
    image_dhash: str
    ocr_mode: str
    ocr_text_raw: str | None = None
    ocr_json: dict | None = None          # better as dict than str
    parsed_json: dict | None = None       # your parsed receipt structure
    purchase_date: str | None = None
    created_at: str = Field(default_factory=now_iso)

    class Settings:
        name = "receipts"
        indexes = [
            IndexModel([("created_at", ASCENDING)]),
        ]
