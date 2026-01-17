from __future__ import annotations

from beanie import Document
from pydantic import Field
from pymongo import IndexModel, ASCENDING
from datetime import datetime, timezone
from uuid import uuid4
from typing import Literal

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

ShelfLevel = Literal["EAT_NOW", "USE_SOON", "SAFE"]  #No knowledgement
Status = Literal["in_fridge", "consumed", "trashed"]

class InventoryItem(Document):
    id: str = Field(default_factory=lambda: str(uuid4()))

    receipt_id: str  # links to Receipt.id

    name: str
    category: str
    food_type: str | None = None
    quantity: float | None = None
    unit: str | None = None
    price: float | None = None

    purchase_date: str
    predicted_expiry_date: str
    shelf_level: ShelfLevel
    status: Status = "in_fridge"

    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)

    class Settings:
        name = "inventory_items"
        indexes = [
            IndexModel([("receipt_id", ASCENDING)]),
            IndexModel([("status", ASCENDING)]),
            IndexModel([("shelf_level", ASCENDING)]),
            IndexModel([("predicted_expiry_date", ASCENDING)]),
        ]
