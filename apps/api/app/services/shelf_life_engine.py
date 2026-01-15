from __future__ import annotations
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from .rules_loader import load_json

@dataclass
class ShelfLifeResult:
    predicted_expiry_date: date
    shelf_level: str
    shelf_life_days: int

class ShelfLifeEngine:
    def __init__(self, rules_path: Path):
        data = load_json(rules_path)
        self.food_type_days = data.get("food_type_days", {})
        self.category_default_food_type = data.get("category_default_food_type", {})
        self.default_days = int(data.get("default_days", 7))
        self.level_thresholds = data.get("level_thresholds", {"eat_now_ratio": 0.8, "use_soon_ratio": 0.5})

    def _days_for(self, category: str, food_type: str | None) -> int:
        if food_type and food_type in self.food_type_days:
            return int(self.food_type_days[food_type])
        ft = self.category_default_food_type.get(category)
        if ft and ft in self.food_type_days:
            return int(self.food_type_days[ft])
        return self.default_days

    def compute(self, purchase_date: date, category: str, food_type: str | None) -> ShelfLifeResult:
        days = self._days_for(category, food_type)
        expiry = purchase_date + timedelta(days=days)
        today = date.today()
        age_days = (today - purchase_date).days
        if age_days < 0:
            age_days = 0
        ratio = age_days / max(days, 1)
        days_left = (expiry - today).days
        eat_now_ratio = float(self.level_thresholds.get("eat_now_ratio", 0.8))
        use_soon_ratio = float(self.level_thresholds.get("use_soon_ratio", 0.5))
        if days_left <= 0 or ratio >= eat_now_ratio:
            level = "EAT_NOW"
        elif ratio >= use_soon_ratio:
            level = "USE_SOON"
        else:
            level = "SAFE"
        return ShelfLifeResult(predicted_expiry_date=expiry, shelf_level=level, shelf_life_days=days)
