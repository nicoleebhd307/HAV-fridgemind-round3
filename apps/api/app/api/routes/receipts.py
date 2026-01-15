from __future__ import annotations
import json, logging
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4
from fastapi import APIRouter, File, HTTPException, UploadFile
from ...core.config import settings
from ...db import execute, fetchone
from ...services.category_classifier import CategoryClassifier
from ...services.ocr.ocr_service import OCRService
from ...services.receipt_parser import parse_receipt
from ...services.shelf_life_engine import ShelfLifeEngine
from ...utils.hashing import sha256_file, dhash_hex
from ...utils.image_preprocess import preprocess_receipt_image
from ..schemas import ReceiptConfirmRequest, ReceiptParseResponse, ReceiptItemOut, InventoryItemOut

log = logging.getLogger(__name__)
router = APIRouter()

def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

@router.get("/receipts/{receipt_id}")
def get_receipt(receipt_id: str) -> dict[str, Any]:
    row = fetchone("SELECT * FROM receipts WHERE id = ? AND user_id = ?", (receipt_id, settings.DEMO_USER_ID))
    if not row:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return {
        "id": row["id"],
        "purchaseDate": row.get("purchase_date"),
        "ocrMode": row.get("ocr_mode"),
        "originalImagePath": row.get("original_image_path"),
        "preprocessedImagePath": row.get("preprocessed_image_path"),
        "ocrTextRaw": row.get("ocr_text_raw"),
        "parsedJson": json.loads(row.get("parsed_json") or "{}"),
    }

@router.post("/receipts", response_model=ReceiptParseResponse)
async def upload_receipt(image: UploadFile = File(...)):
    if not image.filename:
        raise HTTPException(status_code=400, detail="Missing filename")
    receipt_id = f"r_{uuid4().hex}"
    ext = Path(image.filename).suffix.lower() or ".jpg"
    original_path = settings.UPLOAD_DIR / "receipts" / "original" / f"{receipt_id}{ext}"
    pre_path = settings.UPLOAD_DIR / "receipts" / "preprocessed" / f"{receipt_id}.png"
    original_path.parent.mkdir(parents=True, exist_ok=True)
    pre_path.parent.mkdir(parents=True, exist_ok=True)
    content = await image.read()
    original_path.write_bytes(content)
    preprocess_receipt_image(original_path, pre_path)
    img_sha = sha256_file(pre_path)
    img_dh = dhash_hex(pre_path)

    ocr = OCRService(settings.FIXTURE_DIR).run(pre_path)
    log.info("OCR result: mode=%s, fixture_id=%s, warnings=%s", ocr.mode, ocr.fixture_id, ocr.warnings)
    parsed = parse_receipt(ocr)
    warnings = list(ocr.warnings or []) + list(parsed.get("warnings", []) or [])
    log.info("Parsed receipt: date=%s, items=%d, warnings=%s", parsed.get("purchaseDate"), len(parsed.get("items", [])), warnings)

    purchase_date_str = parsed.get("purchaseDate") or date.today().isoformat()
    try:
        purchase_date = date.fromisoformat(purchase_date_str)
    except Exception:
        purchase_date = date.today()
        warnings.append("BAD_DATE_FORMAT_FALLBACK_NOW")

    classifier = CategoryClassifier(settings.RULES_DIR / "category_keywords.json")
    engine = ShelfLifeEngine(settings.RULES_DIR / "shelf_life_rules.json")

    out_items: list[ReceiptItemOut] = []
    for idx, it in enumerate(parsed.get("items", []) or []):
        name = (it.get("name") or "").strip()
        if not name:
            continue
        qty, unit, price = it.get("quantity"), it.get("unit"), it.get("price")
        conf = float(it.get("confidence") or 0.0)
        cat_res = classifier.classify(name)
        category = it.get("category") or cat_res.category
        food_type = it.get("food_type") or cat_res.food_type
        sl = engine.compute(purchase_date, category, food_type)
        if conf < settings.OCR_LOW_CONF_THRESHOLD:
            warnings.append(f"LOW_CONFIDENCE_ITEM:t{idx+1}")
        out_items.append(ReceiptItemOut(tempId=f"t{idx+1}", name=name, quantity=qty, unit=unit, price=price, category=category, confidence=conf, predictedExpiryDate=sl.predicted_expiry_date.isoformat(), shelfLevel=sl.shelf_level))

    now = _now_iso()
    execute("INSERT INTO receipts (id,user_id,original_image_path,preprocessed_image_path,image_sha256,image_dhash,ocr_mode,ocr_text_raw,ocr_json,parsed_json,purchase_date,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            (receipt_id, settings.DEMO_USER_ID, str(original_path.relative_to(settings.ROOT_DIR)), str(pre_path.relative_to(settings.ROOT_DIR)), img_sha, img_dh, ocr.mode, ocr.raw_text, json.dumps({"mode": ocr.mode, "fixtureId": ocr.fixture_id, "warnings": ocr.warnings or []}, ensure_ascii=False), json.dumps(parsed, ensure_ascii=False), purchase_date.isoformat(), now))

    return ReceiptParseResponse(receiptId=receipt_id, purchaseDate=purchase_date.isoformat(), ocrMode=ocr.mode, items=out_items, warnings=warnings)

@router.post("/receipts/{receipt_id}/confirm", response_model=list[InventoryItemOut])
def confirm_receipt(receipt_id: str, payload: ReceiptConfirmRequest):
    row = fetchone("SELECT * FROM receipts WHERE id = ? AND user_id = ?", (receipt_id, settings.DEMO_USER_ID))
    if not row:
        raise HTTPException(status_code=404, detail="Receipt not found")
    purchase_date_str = payload.purchaseDate or row.get("purchase_date") or date.today().isoformat()
    try:
        purchase_date = date.fromisoformat(purchase_date_str)
    except Exception:
        raise HTTPException(status_code=400, detail="purchaseDate must be ISO format YYYY-MM-DD")

    classifier = CategoryClassifier(settings.RULES_DIR / "category_keywords.json")
    engine = ShelfLifeEngine(settings.RULES_DIR / "shelf_life_rules.json")
    now = _now_iso()
    saved: list[InventoryItemOut] = []
    for it in payload.items:
        name = it.name.strip()
        if not name:
            continue
        cat_res = classifier.classify(name)
        category = it.category or cat_res.category
        food_type = cat_res.food_type
        sl = engine.compute(purchase_date, category, food_type)
        item_id = f"i_{uuid4().hex}"
        execute("INSERT INTO inventory_items (id,user_id,fridge_id,receipt_id,name,category,food_type,quantity,unit,price,purchase_date,predicted_expiry_date,shelf_level,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (item_id, settings.DEMO_USER_ID, settings.DEMO_FRIDGE_ID, receipt_id, name, category, food_type, it.quantity, it.unit, it.price, purchase_date.isoformat(), sl.predicted_expiry_date.isoformat(), sl.shelf_level, "in_fridge", now, now))
        saved.append(InventoryItemOut(id=item_id, receiptId=receipt_id, name=name, category=category, quantity=it.quantity, unit=it.unit, price=it.price, purchaseDate=purchase_date.isoformat(), predictedExpiryDate=sl.predicted_expiry_date.isoformat(), shelfLevel=sl.shelf_level, status="in_fridge", createdAt=now, updatedAt=now))
    return saved
