"""
Test receipt upload and show detailed OCR response with warnings.

Usage:
    python -m app.tools.test_upload --image path/to/receipt.jpg
    python -m app.tools.test_upload --image path/to/receipt.jpg --api-url http://localhost:8000
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from app.core.config import settings
from app.services.ocr.ocr_service import OCRService
from app.services.receipt_parser import parse_receipt
from app.utils.hashing import sha256_file, dhash_hex
from app.utils.image_preprocess import preprocess_receipt_image

def main() -> None:
    ap = argparse.ArgumentParser(description="Test receipt upload and show OCR response details")
    ap.add_argument("--image", required=True, help="Path to receipt image")
    ap.add_argument("--api-url", default="http://localhost:8000", help="API base URL (if testing via HTTP)")
    ap.add_argument("--use-api", action="store_true", help="Test via HTTP API instead of direct OCR")
    args = ap.parse_args()

    image_path = Path(args.image)
    if not image_path.exists():
        raise SystemExit(f"Image not found: {image_path}")

    print("=" * 70)
    print("RECEIPT UPLOAD TEST - OCR RESPONSE REVIEW")
    print("=" * 70)
    print(f"Image: {image_path}")
    print(f"Mode: {'HTTP API' if args.use_api else 'Direct OCR'}")
    print()

    if args.use_api:
        # Test via HTTP API
        import requests
        try:
            with open(image_path, "rb") as f:
                files = {"image": (image_path.name, f, "image/jpeg")}
                resp = requests.post(f"{args.api_url}/api/receipts", files=files, timeout=30)
                resp.raise_for_status()
                data = resp.json()
                
                print("✅ API Response:")
                print("-" * 70)
                print(json.dumps(data, indent=2, ensure_ascii=False))
                print()
                
                print("📊 Summary:")
                print(f"  Receipt ID: {data.get('receiptId')}")
                print(f"  Purchase Date: {data.get('purchaseDate')}")
                print(f"  OCR Mode: {data.get('ocrMode')}")
                print(f"  Items: {len(data.get('items', []))}")
                print(f"  Warnings: {len(data.get('warnings', []))}")
                
                if data.get('warnings'):
                    print("\n⚠️  Warnings:")
                    for w in data.get('warnings', []):
                        print(f"    - {w}")
                else:
                    print("\n✅ No warnings!")
                    
        except Exception as e:
            print(f"❌ API Error: {e}")
            sys.exit(1)
    else:
        # Test direct OCR
        print("Step 1: Preprocessing image...")
        pre_path = Path("/tmp/test_receipt_preprocessed.png")
        pre_path.parent.mkdir(parents=True, exist_ok=True)
        preprocess_receipt_image(image_path, pre_path)
        
        img_sha = sha256_file(pre_path)
        img_dh = dhash_hex(pre_path)
        print(f"  SHA256: {img_sha[:16]}...")
        print(f"  dHash:  {img_dh}")
        print()

        print("Step 2: Running OCR service...")
        ocr_service = OCRService(settings.FIXTURE_DIR)
        ocr = ocr_service.run(pre_path)
        
        if ocr is None:
            print("❌ NO FIXTURE MATCH!")
            print(f"   Image dHash: {img_dh}")
            print(f"   Threshold: {settings.OCR_DHASH_MAX_DISTANCE}")
            print("\n💡 Suggestions:")
            print("   1. Run: python -m app.tools.test_dhash --image <path>")
            print("   2. Check if fixture dHash is set correctly")
            print("   3. Consider increasing OCR_DHASH_MAX_DISTANCE")
            sys.exit(1)

        print(f"  OCR Mode: {ocr.mode}")
        print(f"  Fixture ID: {ocr.fixture_id}")
        print(f"  Raw Text Length: {len(ocr.raw_text)} chars")
        print(f"  OCR Lines: {len(ocr.lines)}")
        if ocr.warnings:
            print(f"  Warnings: {ocr.warnings}")
        print()

        print("Step 3: Parsing receipt...")
        parsed = parse_receipt(ocr)
        print(f"  Purchase Date: {parsed.get('purchaseDate')}")
        print(f"  Items: {len(parsed.get('items', []))}")
        print()

        all_warnings = list(ocr.warnings or []) + list(parsed.get("warnings", []) or [])
        
        print("=" * 70)
        print("FULL OCR RESPONSE")
        print("=" * 70)
        print(json.dumps({
            "ocr": {
                "mode": ocr.mode,
                "fixture_id": ocr.fixture_id,
                "raw_text_length": len(ocr.raw_text),
                "lines_count": len(ocr.lines),
                "warnings": ocr.warnings
            },
            "parsed": {
                "purchaseDate": parsed.get("purchaseDate"),
                "items_count": len(parsed.get("items", [])),
                "items": parsed.get("items", []),
                "warnings": parsed.get("warnings", [])
            },
            "all_warnings": all_warnings
        }, indent=2, ensure_ascii=False))
        print()

        print("=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"✅ OCR Mode: {ocr.mode}")
        print(f"✅ Fixture: {ocr.fixture_id}")
        print(f"✅ Items Parsed: {len(parsed.get('items', []))}")
        print(f"⚠️  Total Warnings: {len(all_warnings)}")
        
        if all_warnings:
            print("\n⚠️  Warnings Breakdown:")
            for w in all_warnings:
                if "FIXTURE_MATCH_APPROX" in w:
                    print(f"  🔶 {w} (approximate match, may need threshold tuning)")
                elif "NO_FIXTURE_MATCH" in w:
                    print(f"  🔴 {w} (critical: fixture not found)")
                elif "LOW_CONFIDENCE" in w:
                    print(f"  🟡 {w} (item confidence below threshold)")
                elif "BAD_DATE" in w or "NO_DATE" in w:
                    print(f"  🟡 {w} (date parsing issue)")
                elif "NO_ITEMS" in w:
                    print(f"  🔴 {w} (critical: no items parsed)")
                else:
                    print(f"  ⚠️  {w}")
        else:
            print("\n✅ No warnings - perfect match!")

        print("\n" + "=" * 70)
        print("RECOMMENDATIONS")
        print("=" * 70)
        
        if any("NO_FIXTURE_MATCH" in w for w in all_warnings):
            print("🔴 CRITICAL: No fixture match found")
            print("   → Run: python -m app.tools.test_dhash --image <path>")
            print("   → Check fixture dHash values")
        elif any("FIXTURE_MATCH_APPROX" in w for w in all_warnings):
            dist_warnings = [w for w in all_warnings if "FIXTURE_MATCH_APPROX" in w]
            for w in dist_warnings:
                try:
                    dist = int(w.split("dhash_dist=")[1])
                    if dist > 12:
                        print(f"🟡 High dHash distance: {dist}")
                        print(f"   → Consider increasing OCR_DHASH_MAX_DISTANCE to {dist + 2}")
                    else:
                        print(f"✅ dHash distance {dist} is acceptable")
                except:
                    pass
        elif len(parsed.get("items", [])) == 0:
            print("🔴 CRITICAL: No items parsed")
            print("   → Check fixture parsed_receipt structure")
        else:
            print("✅ All checks passed!")
            print("   → Ready for demo!")

if __name__ == "__main__":
    main()
