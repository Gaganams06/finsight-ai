import time
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware

from .config import settings
from .api.routes import router, limiter

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Privacy-Policy"] = "Zero-Storage: Bank statements processed strictly in memory"
        return response

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Privacy-First Bank Statement Analysis & Financial Health Monitoring Engine",
    docs_url="/docs",
    redoc_url="/redoc"
)

# SlowAPI Limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security Middleware
app.add_middleware(SecurityHeadersMiddleware)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS != ["*"] else ["*"],
    allow_origin_regex=r"^https?://.*" if "*" in settings.CORS_ORIGINS else None,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(router, prefix=settings.API_PREFIX)
# Also include /health directly at root for cloud health checks
app.include_router(router, prefix="")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
