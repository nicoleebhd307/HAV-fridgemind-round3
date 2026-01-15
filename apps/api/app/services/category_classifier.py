from __future__ import annotations
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from ..utils.text_normalize import normalize_name
from .rules_loader import load_json

@dataclass
class CategoryResult:
    category: str
    food_type: str | None = None
    matched_keyword: str | None = None

class CategoryClassifier:
    def __init__(self, rules_path: Path):
        data = load_json(rules_path)
        self.categories: list[dict[str, Any]] = data.get("categories", [])
        self.default_category: str = data.get("default_category", "Pantry")

    def classify(self, item_name: str) -> CategoryResult:
        n = normalize_name(item_name)
        for cat in self.categories:
            cat_name = cat["name"]
            for kw in cat.get("keywords", []):
                if kw in n:
                    return CategoryResult(category=cat_name, food_type=cat.get("default_food_type"), matched_keyword=kw)
        return CategoryResult(category=self.default_category, food_type=None, matched_keyword=None)
