from __future__ import annotations
import re, unicodedata

def strip_accents(s: str) -> str:
    s = unicodedata.normalize("NFD", s)
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    return unicodedata.normalize("NFC", s)

def normalize_name(s: str) -> str:
    s = s.strip().lower()
    s = strip_accents(s)
    s = re.sub(r"\s+", " ", s)
    return s
