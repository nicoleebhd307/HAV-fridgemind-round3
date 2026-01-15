from __future__ import annotations
import os
from pathlib import Path

def _bool(v: str | None, default: bool = False) -> bool:
    if v is None:
        return default
    return v.strip().lower() in ("1", "true", "yes", "y", "on")

class Settings:
    ROOT_DIR: Path = Path(__file__).resolve().parents[4]
    DEMO_USER_ID: str = os.getenv("DEMO_USER_ID", "demo_user")
    DEMO_FRIDGE_ID: str = os.getenv("DEMO_FRIDGE_ID", "demo_fridge")
    DB_PATH: Path = ROOT_DIR / os.getenv("DB_PATH", "data/app.db")
    UPLOAD_DIR: Path = ROOT_DIR / os.getenv("UPLOAD_DIR", "data/uploads")
    FIXTURE_DIR: Path = ROOT_DIR / os.getenv("FIXTURE_DIR", "data/fixtures/receipts/ocr_cache")
    RULES_DIR: Path = ROOT_DIR / os.getenv("RULES_DIR", "data/rules")

    OCR_MODE: str = os.getenv("OCR_MODE", "mock")  # mock | paddle | auto
    OCR_DHASH_MAX_DISTANCE: int = int(os.getenv("OCR_DHASH_MAX_DISTANCE", "14"))
    OCR_LOW_CONF_THRESHOLD: float = float(os.getenv("OCR_LOW_CONF_THRESHOLD", "0.75"))

    PADDLE_OCR_LANG: str = os.getenv("PADDLE_OCR_LANG", "en")
    PADDLE_OCR_USE_ANGLE_CLS: bool = _bool(os.getenv("PADDLE_OCR_USE_ANGLE_CLS"), True)
    PADDLE_OCR_CPU_THREADS: int = int(os.getenv("PADDLE_OCR_CPU_THREADS", "4"))

settings = Settings()
