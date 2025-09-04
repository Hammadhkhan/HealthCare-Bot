from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
import logging

# Rate limiter (100 requests per 15 minutes per IP)
limiter = Limiter(key_func=get_remote_address, default_limits=["100/15minute"])

logger = logging.getLogger("uvicorn.access")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logger.info(f"{request.method} {request.url}")
        response: Response = await call_next(request)
        return response
