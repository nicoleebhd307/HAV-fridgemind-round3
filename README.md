# FridgeMind Demo — Full Project (FE + BE + OCR/Parsing)

Monorepo structure:
- `apps/api`: FastAPI backend (SQLite + receipt upload + OCR mock/cached + parsing + inventory)
- `apps/web`: Vite + React + TS frontend (Scan → Confirm (category-first) → Inventory)
- `data/`: local storage (SQLite db, uploads, fixtures, rules)

## Run locally

### Backend

**Windows (PowerShell):**
```powershell
cd apps/api
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Or use the provided script:
```powershell
cd apps/api
.\run.ps1
```

**Linux/Mac:**
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd apps/web
npm install
npm run dev
```

- FE: http://localhost:5173
- BE: http://localhost:8000

## Fixtures (demo-safe mock OCR)
Create fixture skeleton:
```bash
cd apps/api
python -m app.tools.register_fixture --image ../../data/fixtures/receipts/images/winmart_01.jpg --id winmart_01
```
Then edit `data/fixtures/receipts/ocr_cache/winmart_01.json` and fill `parsed_receipt`.

## Reset demo data
```bash
curl -X POST http://localhost:8000/api/demo/reset
```
