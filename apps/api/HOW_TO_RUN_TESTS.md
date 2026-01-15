# Hướng Dẫn Chạy Test dHash và Test Upload

## 📋 Yêu Cầu

1. **Python 3.8+** đã cài đặt
2. **Virtual environment** đã được activate
3. **Dependencies** đã được install (`pip install -r requirements.txt`)

---

## 🚀 Cách Chạy

### Bước 1: Mở Terminal và Navigate đến thư mục API

**Windows PowerShell:**
```powershell
cd apps/api
```

**Linux/Mac:**
```bash
cd apps/api
```

### Bước 2: Activate Virtual Environment (nếu chưa activate)

**Windows PowerShell:**
```powershell
.venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
source .venv/bin/activate
```

---

## 🧪 Test 1: Test dHash Distance

### Mục đích
Kiểm tra xem ảnh receipt có match với fixtures không và distance là bao nhiêu.

### Cú pháp cơ bản
```powershell
python -m app.tools.test_dhash --image <đường_dẫn_đến_ảnh>
```

### Ví dụ cụ thể

#### Ví dụ 1: Test với ảnh trong project
```powershell
# Nếu ảnh nằm trong data/fixtures/receipts/images/
python -m app.tools.test_dhash --image ../../data/fixtures/receipts/images/winmart_demo.jpg

# Hoặc dùng đường dẫn tuyệt đối
python -m app.tools.test_dhash --image C:\Users\flowe\Downloads\fridgemind-demo-full\data\fixtures\receipts\images\winmart_demo.jpg
```

#### Ví dụ 2: Test với threshold tùy chỉnh
```powershell
python -m app.tools.test_dhash --image path/to/receipt.jpg --max-dist 16
```

#### Ví dụ 3: Test với ảnh từ Desktop
```powershell
python -m app.tools.test_dhash --image C:\Users\flowe\Desktop\receipt.jpg
```

### Output mẫu
```
Testing dHash matching for: winmart_demo.jpg
Max distance threshold: 14
------------------------------------------------------------
Image SHA256: abc123def456...
Image dHash:  a1b2c3d4e5f6...

Found 2 fixture(s):

dHash Distance Results:
------------------------------------------------------------
✅ MATCH | winmart_demo       | Distance:  5 | dHash: a1b2c3d4...
❌ NO MATCH | winmart_backup   | Distance: 18 | dHash: f6e5d4c3...

✅ BEST MATCH: winmart_demo (distance: 5)
   This image will be matched to fixture: ...\winmart_demo.json
```

---

## 🧪 Test 2: Test Upload (Full OCR Flow)

### Mục đích
Test toàn bộ flow từ upload → OCR → parsing → warnings, giống như khi upload qua API.

### Có 2 cách chạy:

#### Cách 1: Direct OCR (Không cần API server chạy) ⭐ **Khuyến nghị**

```powershell
python -m app.tools.test_upload --image <đường_dẫn_đến_ảnh>
```

**Ví dụ:**
```powershell
python -m app.tools.test_upload --image ../../data/fixtures/receipts/images/winmart_demo.jpg
```

**Ưu điểm:**
- ✅ Không cần chạy API server
- ✅ Nhanh hơn
- ✅ Show đầy đủ thông tin OCR và warnings

---

#### Cách 2: Via HTTP API (Cần API server chạy)

**Bước 1:** Start API server (terminal khác):
```powershell
cd apps/api
.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

**Bước 2:** Chạy test (terminal mới):
```powershell
cd apps/api
.venv\Scripts\Activate.ps1
python -m app.tools.test_upload --image path/to/receipt.jpg --use-api
```

**Ví dụ:**
```powershell
python -m app.tools.test_upload --image ../../data/fixtures/receipts/images/winmart_demo.jpg --use-api --api-url http://localhost:8000
```

**Ưu điểm:**
- ✅ Test giống hệt như user upload qua web
- ✅ Test cả preprocessing và API response format

---

### Output mẫu (Direct OCR)

```
======================================================================
RECEIPT UPLOAD TEST - OCR RESPONSE REVIEW
======================================================================
Image: winmart_demo.jpg
Mode: Direct OCR

Step 1: Preprocessing image...
  SHA256: abc123def456...
  dHash:  a1b2c3d4e5f6...

Step 2: Running OCR service...
  OCR Mode: mock
  Fixture ID: winmart_demo
  Raw Text Length: 0 chars
  OCR Lines: 0

Step 3: Parsing receipt...
  Purchase Date: 2025-04-14
  Items: 3

======================================================================
FULL OCR RESPONSE
======================================================================
{
  "ocr": {
    "mode": "mock",
    "fixture_id": "winmart_demo",
    "raw_text_length": 0,
    "lines_count": 0,
    "warnings": []
  },
  "parsed": {
    "purchaseDate": "2025-04-14",
    "items_count": 3,
    "items": [
      {
        "name": "Nước sốt dầu dấm trộn salad Nam Dương 250g",
        "quantity": 1,
        "unit": null,
        "price": 20200,
        "confidence": 0.95
      },
      ...
    ],
    "warnings": []
  },
  "all_warnings": []
}

======================================================================
SUMMARY
======================================================================
✅ OCR Mode: mock
✅ Fixture: winmart_demo
✅ Items Parsed: 3
⚠️  Total Warnings: 0

✅ No warnings - perfect match!

======================================================================
RECOMMENDATIONS
======================================================================
✅ All checks passed!
   → Ready for demo!
```

---

## 📝 Workflow Hoàn Chỉnh

### Scenario: Bạn có ảnh receipt mới và muốn tạo fixture

**Bước 1:** Test dHash để xem có match không
```powershell
python -m app.tools.test_dhash --image C:\Users\flowe\Desktop\new_receipt.jpg
```

**Bước 2:** Nếu không match, register fixture mới
```powershell
python -m app.tools.register_fixture --image C:\Users\flowe\Desktop\new_receipt.jpg --id winmart_new
```

**Bước 3:** Edit file fixture JSON
```powershell
# Mở file: data/fixtures/receipts/ocr_cache/winmart_new.json
# Copy SHA256 và dHash từ output của register_fixture
# Thêm parsed_receipt structure
```

**Bước 4:** Test lại với test_upload
```powershell
python -m app.tools.test_upload --image C:\Users\flowe\Desktop\new_receipt.jpg
```

**Bước 5:** Test với nhiều điều kiện ánh sáng
```powershell
# Chụp lại ảnh sáng hơn/tối hơn/nghiêng
python -m app.tools.test_upload --image C:\Users\flowe\Desktop\new_receipt_bright.jpg
python -m app.tools.test_upload --image C:\Users\flowe\Desktop\new_receipt_dark.jpg
```

---

## 🔧 Troubleshooting

### Lỗi: `ModuleNotFoundError: No module named 'app'`

**Nguyên nhân:** Đang ở sai thư mục hoặc chưa activate venv.

**Fix:**
```powershell
# Đảm bảo đang ở apps/api
cd apps/api

# Activate venv
.venv\Scripts\Activate.ps1

# Chạy lại
python -m app.tools.test_dhash --image ...
```

---

### Lỗi: `Image not found`

**Nguyên nhân:** Đường dẫn ảnh sai.

**Fix:**
- Dùng đường dẫn tuyệt đối: `C:\Users\flowe\Desktop\receipt.jpg`
- Hoặc đường dẫn tương đối từ `apps/api`: `../../data/fixtures/receipts/images/receipt.jpg`
- Kiểm tra file có tồn tại không: `Test-Path C:\Users\flowe\Desktop\receipt.jpg`

---

### Lỗi: `No fixtures loaded`

**Nguyên nhân:** Chưa có fixtures trong `data/fixtures/receipts/ocr_cache/`.

**Fix:**
```powershell
# Register fixture trước
python -m app.tools.register_fixture --image path/to/receipt.jpg --id winmart_demo
```

---

### Warning: `NO_FIXTURE_MATCH`

**Nguyên nhân:** dHash distance quá cao hoặc fixture chưa có dHash.

**Fix:**
```powershell
# 1. Check distance
python -m app.tools.test_dhash --image path/to/receipt.jpg

# 2. Nếu distance > threshold, tăng threshold trong config.py
# Hoặc set env var: $env:OCR_DHASH_MAX_DISTANCE="16"

# 3. Hoặc register lại fixture với ảnh gốc
python -m app.tools.register_fixture --image path/to/original_receipt.jpg --id winmart_demo
```

---

## 💡 Tips

1. **Luôn test với nhiều điều kiện ánh sáng** để đảm bảo match ổn định
2. **Dùng `test_dhash` trước** để check distance nhanh
3. **Dùng `test_upload` để verify** toàn bộ flow
4. **Check warnings** trong output để fix issues sớm
5. **Giữ ảnh gốc** để có thể register lại fixture nếu cần

---

## 📚 Tham Khảo Thêm

- `OCR_WARNINGS_GUIDE.md` - Giải thích chi tiết về warnings
- `README.md` - Tổng quan về project
- `register_fixture.py` - Tạo fixture mới
