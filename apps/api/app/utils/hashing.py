from __future__ import annotations
import hashlib
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def dhash_hex(image_path: Path, hash_size: int = 8) -> str:
    img = Image.open(image_path)
    img = ImageOps.exif_transpose(img)
    img = img.convert("L").resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = np.asarray(img, dtype=np.int16)
    diff = pixels[:, 1:] > pixels[:, :-1]
    bits = diff.flatten()
    value = 0
    for bit in bits:
        value = (value << 1) | int(bool(bit))
    return f"{value:0{hash_size*hash_size//4}x}"

def hamming_distance_hex(a: str, b: str) -> int:
    if len(a) != len(b):
        raise ValueError("hash lengths differ")
    x = int(a, 16) ^ int(b, 16)
    return x.bit_count()
