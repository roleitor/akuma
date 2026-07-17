from app.api.routes.documents import router as documents_router
from app.api.routes.verifications import router as verifications_router
from app.api.routes.sync import router as sync_router
from app.api.routes.health import router as health_router

__all__ = ["documents_router", "verifications_router", "sync_router", "health_router"]
