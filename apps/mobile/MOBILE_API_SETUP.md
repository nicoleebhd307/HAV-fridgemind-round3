# Mobile App API Integration Guide

## 📱 Cách kết nối Mobile App với Backend

### 1. Cấu hình Backend CORS

Backend đã được cấu hình để cho phép mobile app kết nối. Có 2 cách:

#### Option A: Allow tất cả (Development)
```bash
# Windows PowerShell
$env:CORS_ALLOW_ALL="true"
cd apps/api
python -m uvicorn app.main:app --reload --port 8000

# Linux/Mac
export CORS_ALLOW_ALL=true
cd apps/api
python -m uvicorn app.main:app --reload --port 8000
```

#### Option B: Thêm IP cụ thể (Recommended)
Sửa `apps/api/app/main.py` và thêm IP của bạn vào `allow_origins`:
```python
allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.100:8081",  # ← Thêm IP của bạn ở đây
]
```

### 2. Tìm IP Address của máy tính

**Windows:**
```powershell
ipconfig
# Tìm "IPv4 Address" (ví dụ: 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig
# hoặc
ip addr show
# Tìm IP trong network interface (ví dụ: 192.168.1.100)
```

### 3. Cấu hình Mobile App

Sửa file `apps/mobile/lib/api/config.ts`:

```typescript
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.100:8000' // ⚠️ Đổi thành IP của bạn
  : 'https://api.yourdomain.com';
```

**Lưu ý quan trọng:**
- ✅ Dùng IP của máy tính (không phải `localhost` hoặc `127.0.0.1`)
- ✅ Đảm bảo mobile và máy tính cùng WiFi network
- ✅ Port phải là `8000` (backend port)

### 4. Chạy Backend

```bash
cd apps/api
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows
# hoặc
source .venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

**Quan trọng:** Phải dùng `--host 0.0.0.0` để cho phép kết nối từ network!

### 5. Chạy Mobile App

```bash
cd apps/mobile
npm install
npm start
```

Sau đó:
- Scan QR code bằng Expo Go app (iOS/Android)
- Hoặc chạy trên simulator/emulator

### 6. Test kết nối

1. Mở Expo Go trên điện thoại
2. Scan QR code từ terminal
3. App sẽ load và gọi API
4. Kiểm tra Network tab trong Expo DevTools để xem requests

### 7. Troubleshooting

#### ❌ "Network request failed"
- ✅ Kiểm tra IP address trong `config.ts` đúng chưa
- ✅ Đảm bảo mobile và máy tính cùng WiFi
- ✅ Backend đang chạy với `--host 0.0.0.0`
- ✅ Firewall không block port 8000

#### ❌ CORS Error
- ✅ Set `CORS_ALLOW_ALL=true` hoặc thêm IP vào `allow_origins`
- ✅ Restart backend sau khi đổi CORS config

#### ❌ "Connection refused"
- ✅ Backend đang chạy chưa? Check `http://localhost:8000/api/health`
- ✅ IP address đúng chưa? Test từ browser mobile: `http://YOUR_IP:8000/api/health`

### 8. API Endpoints Available

Mobile app có thể gọi các endpoints sau:

- `POST /api/receipts` - Upload receipt image
- `POST /api/receipts/{id}/confirm` - Confirm receipt
- `GET /api/inventory` - Get inventory items
- `PATCH /api/inventory/{itemId}` - Update item status
- `POST /api/demo/reset` - Reset demo data
- `GET /api/todos` - Get todos (new)
- `POST /api/todos` - Create todo (new)

### 9. Next Steps

1. ✅ API client đã được tạo (`lib/api/client.ts`)
2. ⏳ Cần update các screen để dùng API thay vì mock:
   - `app/(tabs)/scan.tsx` - Upload receipt
   - `app/(tabs)/inventory.tsx` - Load inventory
   - `app/scan/review.tsx` - Confirm receipt

### 10. Production Setup

Khi deploy production:
- Thay `API_BASE_URL` trong `config.ts` bằng production URL
- Cấu hình CORS chỉ cho phép domain của bạn
- Sử dụng HTTPS
