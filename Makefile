.PHONY: api web

api:
	cd apps/api && uvicorn app.main:app --reload --port 8000

web:
	cd apps/web && npm run dev
