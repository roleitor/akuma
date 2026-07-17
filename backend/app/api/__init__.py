from fastapi import APIRouter

from app.api.routes import documents_router, verifications_router, sync_router, health_router

api_router = APIRouter()
api_router.include_router(documents_router)
api_router.include_router(verifications_router)
api_router.include_router(sync_router)
api_router.include_router(health_router)
