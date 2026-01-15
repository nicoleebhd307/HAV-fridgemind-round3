# OCR Response Warnings Guide

Tài liệu này giải thích các warnings có thể xuất hiện trong OCR response và cách debug/fix.

## 📋 Các Loại Warnings

### 🔴 Critical Warnings (Demo sẽ fail)

#### `NO_FIXTURE_MATCH`
**Nguyên nhân:** Không tìm thấy fixture match cho ảnh upload.

**Cách debug:**
```bash
# Test dHash distance
python -m app.tools.test_dhash --image path/to/receipt.jpg

# Xem log chi tiết
python -m app.tools.test_upload --image path/to/receipt.jpg
```

**Cách fix:**
1. Kiểm tra fixture có dHash được set chưa:
   ```bash
   python -m app.tools.register_fixture --image <path> --id <fixture_id>
   ```
2. Nếu distance quá cao (> threshold), tăng `OCR_DHASH_MAX_DISTANCE`:
   ```env
   OCR_DHASH_MAX_DISTANCE=16  # hoặc cao hơn
   ```
3. Hoặc chụp lại ảnh gần giống fixture hơn.

---

#### `NO_ITEMS_PARSED`
**Nguyên nhân:** Không parse được items từ OCR text.

**Cách debug:**
- Check fixture `parsed_receipt` structure
- Verify items có đúng format không

**Cách fix:**
- Đảm bảo fixture có `parsed_receipt.items` array hợp lệ
- Hoặc check OCR text raw có đủ thông tin không

---

### 🟡 Warning Warnings (Demo vẫn chạy nhưng có thể cải thiện)

#### `FIXTURE_MATCH_APPROX:dhash_dist=X`
**Nguyên nhân:** Match được fixture nhưng dHash distance > 0 (không phải exact match).

**Ý nghĩa:**
- `dhash_dist=0`: Exact match (SHA256 hoặc dHash perfect)
- `dhash_dist=1-8`: Rất tốt, match chắc chắn
- `dhash_dist=9-14`: Tốt, trong threshold
- `dhash_dist=15-18`: Có thể match nhưng nên tăng threshold
- `dhash_dist>18`: Không nên match (risk match nhầm)

**Cách fix:**
- Nếu distance > 12: cân nhắc tăng threshold
- Nếu distance > 16: có thể cần chụp lại ảnh gần hơn

---

#### `LOW_CONFIDENCE_ITEM:tX`
**Nguyên nhân:** Item thứ X có confidence < `OCR_LOW_CONF_THRESHOLD` (default: 0.75).

**Cách fix:**
- Tăng confidence trong fixture item
- Hoặc giảm threshold: `OCR_LOW_CONF_THRESHOLD=0.7`

---

#### `BAD_DATE_FORMAT_FALLBACK_NOW`
**Nguyên nhân:** Không parse được purchase date từ receipt, fallback về today.

**Cách fix:**
- Đảm bảo fixture có `parsed_receipt.purchaseDate` đúng format ISO (YYYY-MM-DD)

---

#### `NO_DATE_FOUND_FALLBACK_NOW`
**Nguyên nhân:** Không tìm thấy date trong OCR text (khi không dùng fixture parsed_receipt).

**Cách fix:**
- Dùng fixture với `parsed_receipt.purchaseDate` set sẵn

---

#### `EMPTY_OCR_TEXT`
**Nguyên nhân:** OCR text rỗng (khi không dùng fixture).

**Cách fix:**
- Dùng fixture mode với `parsed_receipt` set sẵn

---

### 🔵 Info Warnings (Không ảnh hưởng)

#### `OCR_FAILED`
**Nguyên nhân:** PaddleOCR failed (khi dùng mode "auto" hoặc "paddle").

**Cách fix:**
- Check PaddleOCR installation
- Hoặc dùng mode "mock" với fixtures

---

#### `OCR_MODE_UNKNOWN`
**Nguyên nhân:** OCR_MODE không hợp lệ.

**Cách fix:**
- Set `OCR_MODE=mock` hoặc `OCR_MODE=auto` hoặc `OCR_MODE=paddle`

---

## 🧪 Testing Tools

### 1. Test dHash Distance
```bash
python -m app.tools.test_dhash --image path/to/receipt.jpg
python -m app.tools.test_dhash --image path/to/receipt.jpg --max-dist 16
```

**Output:**
- Shows distance to all fixtures
- Indicates if match would succeed
- Suggests threshold adjustment

---

### 2. Test Full Upload Flow
```bash
# Direct OCR (không cần API server)
python -m app.tools.test_upload --image path/to/receipt.jpg

# Via HTTP API
python -m app.tools.test_upload --image path/to/receipt.jpg --use-api --api-url http://localhost:8000
```

**Output:**
- Full OCR response JSON
- All warnings breakdown
- Recommendations for fixes

---

### 3. Register New Fixture
```bash
python -m app.tools.register_fixture --image path/to/receipt.jpg --id winmart_demo
```

Sau đó edit file JSON để set `parsed_receipt` structure.

---

## 📊 Warnings Flow trong Code

```
Upload Image
    ↓
Preprocess Image
    ↓
OCR Service
    ├─→ MockOCR.match()
    │   ├─→ SHA256 match? → exact match
    │   └─→ dHash match? → approximate match (warning nếu dist > 0)
    │
    └─→ OCRResult với warnings
        ↓
Receipt Parser
    ├─→ Có parsed_receipt từ fixture? → dùng luôn
    └─→ Không? → parse từ OCR text
        ├─→ Extract date → warning nếu fail
        └─→ Parse items → warning nếu không có items
            ↓
Combine warnings
    ↓
Response với warnings array
```

---

## ✅ Checklist cho Demo "Không Fail"

| Check | Status | Action nếu fail |
|-------|--------|----------------|
| Fixture có dHash set | ✅ | Run `register_fixture` |
| dHash distance ≤ 14 | ✅ | Test với `test_dhash` |
| Không có `NO_FIXTURE_MATCH` | ✅ | Check fixture hoặc tăng threshold |
| Có `parsed_receipt` trong fixture | ✅ | Edit fixture JSON |
| Items có confidence ≥ 0.75 | ✅ | Tăng confidence hoặc giảm threshold |
| Purchase date đúng format | ✅ | Set `purchaseDate` trong fixture |
| Test upload 5 lần → không fail | ✅ | Test với `test_upload` |

---

## 🎯 Best Practices

1. **Luôn dùng fixtures với `parsed_receipt` set sẵn** → tránh parse errors
2. **Set dHash threshold = 14-16** → balance giữa flexibility và accuracy
3. **Test với nhiều điều kiện ánh sáng** → đảm bảo match ổn định
4. **Log warnings trong production** → monitor và tune threshold
5. **Confidence ≥ 0.9 cho demo items** → tránh LOW_CONFIDENCE warnings

---

## 📝 Example: Perfect Demo Setup

```json
{
  "id": "winmart_demo",
  "sha256": "<auto>",
  "dhash": "<auto>",
  "parsed_receipt": {
    "purchaseDate": "2025-04-14",
    "items": [
      {
        "name": "Sữa thanh trùng Mộc Châu không đường 900ml",
        "quantity": 1,
        "unit": "ml",
        "price": 40700,
        "confidence": 0.96  // ≥ 0.9 để tránh warning
      }
    ],
    "warnings": []  // Empty để không có warnings
  }
}
```

**Config:**
```env
OCR_MODE=mock
OCR_DHASH_MAX_DISTANCE=14
OCR_LOW_CONF_THRESHOLD=0.75
```

**Result:** ✅ Zero warnings, perfect demo!
