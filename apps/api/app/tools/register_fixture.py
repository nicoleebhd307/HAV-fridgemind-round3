from __future__ import annotations
import argparse, json
from pathlib import Path
from app.utils.hashing import sha256_file, dhash_hex

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True)
    ap.add_argument("--id", required=True)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    image_path = Path(args.image)
    if not image_path.exists():
        raise SystemExit(f"Image not found: {image_path}")

    sha = sha256_file(image_path)
    dh = dhash_hex(image_path)

    repo_root = Path(__file__).resolve().parents[4]
    default_out = repo_root / "data/fixtures/receipts/ocr_cache" / f"{args.id}.json"
    out = Path(args.out) if args.out else default_out
    out.parent.mkdir(parents=True, exist_ok=True)

    payload = {"id": args.id, "sha256": sha, "dhash": dh, "ocrTextRaw": "", "parsed_receipt": {"purchaseDate": None, "items": [], "warnings": ["FIXTURE_TEMPLATE_EDIT_ME"]}}
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote fixture skeleton: {out}")

if __name__ == "__main__":
    main()
