from __future__ import annotations
from contextlib import asynccontextmanager
import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .api.router import api_router
from .core.config import settings
from .core.logging import setup_logging
from .db import init_db
from .mongo_db import close as mongo_close, connect_and_init as mongo_init_db

setup_logging()
log = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    # init_db()
    await mongo_init_db()
    log.info("MongoDB initialized")
    yield
    # Shutdown (if needed)
    await mongo_close()

app = FastAPI(title="FridgeMind Demo API", version="0.3.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # Mobile app (Expo Go, development)
        # Add your local network IP here, e.g., "http://192.168.1.100:8081"
        # Or use "*" for development (less secure)
    ] + (["*"] if os.getenv("CORS_ALLOW_ALL", "false").lower() == "true" else []),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR), html=False), name="uploads")

app.include_router(api_router)
