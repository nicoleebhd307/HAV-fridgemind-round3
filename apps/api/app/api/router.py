from fastapi import APIRouter
from .routes.health import router as health_router
from .routes.receipts import router as receipts_router
from .routes.inventory import router as inventory_router
from .routes.demo import router as demo_router
from .routes.todos import router as todos_router

api_router = APIRouter(prefix="/api")
api_router.include_router(health_router, tags=["health"])
api_router.include_router(receipts_router, tags=["receipts"])
api_router.include_router(inventory_router, tags=["inventory"])
api_router.include_router(todos_router, tags=["todos"])
api_router.include_router(demo_router, tags=["demo"])
