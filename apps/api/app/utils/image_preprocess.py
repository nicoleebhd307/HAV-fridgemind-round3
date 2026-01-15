from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps

def preprocess_receipt_image(src_path: Path, dst_path: Path, max_width: int = 1600) -> None:
    img = Image.open(src_path)
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGB")
    w, h = img.size
    if w > max_width:
        new_h = int(h * (max_width / w))
        img = img.resize((max_width, new_h), Image.Resampling.LANCZOS)
    img = ImageEnhance.Contrast(img).enhance(1.25)
    img = img.convert("L")
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst_path)
