from __future__ import annotations
from datetime import date, datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, HTTPException
from ...core.config import settings
from ...db import execute, fetchall, fetchone
from ...services.category_classifier import CategoryClassifier
from ...services.shelf_life_engine import ShelfLifeEngine
from ..schemas import InventoryItemOut, InventoryManualCreate, InventoryUpdate

router = APIRouter()

def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

@router.get("/inventory", response_model=list[InventoryItemOut])
def list_inventory():
    rows = fetchall("SELECT * FROM inventory_items WHERE user_id = ? ORDER BY created_at DESC", (settings.DEMO_USER_ID,))
    return [InventoryItemOut(id=r["id"], receiptId=r.get("receipt_id"), name=r["name"], category=r["category"], quantity=r.get("quantity"), unit=r.get("unit"), price=r.get("price"), purchaseDate=r["purchase_date"], predictedExpiryDate=r["predicted_expiry_date"], shelfLevel=r["shelf_level"], status=r["status"], createdAt=r["created_at"], updatedAt=r["updated_at"]) for r in rows]

@router.post("/inventory/manual", response_model=InventoryItemOut)
def manual_add(payload: InventoryManualCreate):
    classifier = CategoryClassifier(settings.RULES_DIR / "category_keywords.json")
    engine = ShelfLifeEngine(settings.RULES_DIR / "shelf_life_rules.json")
    purchase = payload.purchaseDate or date.today().isoformat()
    try:
        purchase_date = date.fromisoformat(purchase)
    except Exception:
        raise HTTPException(status_code=400, detail="purchaseDate must be ISO format YYYY-MM-DD")
    cat_res = classifier.classify(payload.name)
    category = payload.category or cat_res.category
    food_type = cat_res.food_type
    sl = engine.compute(purchase_date, category, food_type)
    now = _now_iso()
    item_id = f"i_{uuid4().hex}"
    execute("INSERT INTO inventory_items (id,user_id,fridge_id,receipt_id,name,category,food_type,quantity,unit,price,purchase_date,predicted_expiry_date,shelf_level,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (item_id, settings.DEMO_USER_ID, settings.DEMO_FRIDGE_ID, None, payload.name, category, food_type, payload.quantity, payload.unit, payload.price, purchase_date.isoformat(), sl.predicted_expiry_date.isoformat(), sl.shelf_level, "in_fridge", now, now))
    return InventoryItemOut(id=item_id, receiptId=None, name=payload.name, category=category, quantity=payload.quantity, unit=payload.unit, price=payload.price, purchaseDate=purchase_date.isoformat(), predictedExpiryDate=sl.predicted_expiry_date.isoformat(), shelfLevel=sl.shelf_level, status="in_fridge", createdAt=now, updatedAt=now)

@router.patch("/inventory/{item_id}", response_model=InventoryItemOut)
def update_item(item_id: str, payload: InventoryUpdate):
    row = fetchone("SELECT * FROM inventory_items WHERE id = ? AND user_id = ?", (item_id, settings.DEMO_USER_ID))
    if not row:
        raise HTTPException(status_code=404, detail="Item not found")
    new_status = payload.status or row["status"]
    now = _now_iso()
    execute("UPDATE inventory_items SET status = ?, updated_at = ? WHERE id = ?", (new_status, now, item_id))
    row2 = fetchone("SELECT * FROM inventory_items WHERE id = ?", (item_id,))
    assert row2 is not None
    return InventoryItemOut(id=row2["id"], receiptId=row2.get("receipt_id"), name=row2["name"], category=row2["category"], quantity=row2.get("quantity"), unit=row2.get("unit"), price=row2.get("price"), purchaseDate=row2["purchase_date"], predictedExpiryDate=row2["predicted_expiry_date"], shelfLevel=row2["shelf_level"], status=row2["status"], createdAt=row2["created_at"], updatedAt=row2["updated_at"])
