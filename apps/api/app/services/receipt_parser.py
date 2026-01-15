from __future__ import annotations
import re
from dataclasses import dataclass
from datetime import date
from typing import Any
from .ocr.types import OCRResult

DATE_PATTERNS = [re.compile(r"\b(?P<d>\d{1,2})[\/\-](?P<m>\d{1,2})[\/\-](?P<y>\d{2,4})\b")]
PRICE_AT_END = re.compile(r"(?P<price>\d{1,3}(?:[\.,]\d{3})+|\d+)\s*$")
QTY_UNIT = re.compile(r"(?P<qty>\d+(?:[\.,]\d+)?)\s*(?P<unit>kg|g|gram|l|ml|chai|lon|hop|hộp|goi|gói|pack|pcs|pc)\b", re.IGNORECASE)
IGNORE_LINE = re.compile(r"\b(tong|total|vat|thue|cash|tien|cam on|change|giam gia)\b", re.IGNORECASE)

def _parse_price(s: str) -> float | None:
    s = s.strip()
    if not s:
        return None
    s = s.replace(",", "").replace(".", "")
    try:
        return float(int(s))
    except Exception:
        return None

def _parse_qty_unit(s: str) -> tuple[float | None, str | None]:
    m = QTY_UNIT.search(s)
    if not m:
        return None, None
    qty_raw = m.group("qty").replace(",", ".")
    try:
        qty = float(qty_raw)
    except Exception:
        qty = None
    unit = m.group("unit").lower().replace("hộp", "hop").replace("gói", "goi")
    return qty, unit

def extract_purchase_date(text: str) -> tuple[date | None, list[str]]:
    if not text:
        return None, ["EMPTY_OCR_TEXT"]
    for pat in DATE_PATTERNS:
        m = pat.search(text)
        if m:
            d, mo, y = int(m.group("d")), int(m.group("m")), int(m.group("y"))
            if y < 100:
                y += 2000
            try:
                return date(y, mo, d), []
            except Exception:
                continue
    return None, ["NO_DATE_FOUND_FALLBACK_NOW"]

@dataclass
class ParsedItem:
    name: str
    quantity: float | None
    unit: str | None
    price: float | None
    confidence: float

def parse_items_from_textlines(lines: list[tuple[str, float]]) -> tuple[list[ParsedItem], list[str]]:
    items: list[ParsedItem] = []
    for text, conf in lines:
        t = text.strip()
        if not t or IGNORE_LINE.search(t) or not re.search(r"[A-Za-zÀ-ỹà-ỹ]", t):
            continue
        m_price = PRICE_AT_END.search(t)
        if not m_price:
            continue
        price = _parse_price(m_price.group("price"))
        left = t[: m_price.start("price")].strip()
        if not left:
            continue
        qty, unit = _parse_qty_unit(left)
        name = QTY_UNIT.sub("", left).strip() if (qty is not None and unit is not None) else left
        name = re.sub(r"[^0-9A-Za-zÀ-ỹà-ỹ\s\-_/]", " ", name)
        name = re.sub(r"\s+", " ", name).strip()
        if len(name) < 2:
            continue
        items.append(ParsedItem(name=name, quantity=qty or 1, unit=unit, price=price, confidence=float(conf)))
    return items, ([] if items else ["NO_ITEMS_PARSED"])

def parse_receipt(ocr: OCRResult) -> dict[str, Any]:
    if ocr.parsed_receipt:
        return ocr.parsed_receipt
    lines = [(ln.text, ln.confidence) for ln in ocr.lines] if ocr.lines else [(t, 0.85) for t in (ocr.raw_text or "").splitlines()]
    pd, w_date = extract_purchase_date(ocr.raw_text or "")
    items, w_items = parse_items_from_textlines(lines)
    return {"purchaseDate": pd.isoformat() if pd else None, "items": [{"name": i.name, "quantity": i.quantity, "unit": i.unit, "price": i.price, "confidence": i.confidence} for i in items], "warnings": w_date + w_items}
