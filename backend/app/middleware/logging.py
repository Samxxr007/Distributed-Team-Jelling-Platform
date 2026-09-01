from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
import uuid
import time
import logging

logger = logging.getLogger("jelling")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        start_time = time.time()
        
        response = await call_next(request)
        
        duration = time.time() - start_time
        response.headers["X-Request-ID"] = request_id
        
        logger.info({
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "duration": duration
        })
        
        return response
