from __future__ import annotations
from dataclasses import dataclass
from typing import Any

@dataclass
class OCRLine:
    text: str
    confidence: float
    bbox: Any | None = None

@dataclass
class OCRResult:
    mode: str
    raw_text: str
    lines: list[OCRLine]
    fixture_id: str | None = None
    parsed_receipt: dict[str, Any] | None = None
    warnings: list[str] | None = None
