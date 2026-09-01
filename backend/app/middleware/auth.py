from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.redis_client import redis_client
import time

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        # Very simple rate limit (100 req/min)
        redis = redis_client.get_client()
        key = f"rate_limit:{client_ip}"
        
        current_time = int(time.time())
        window_start = current_time - 60
        
        await redis.zremrangebyscore(key, 0, window_start)
        count = await redis.zcard(key)
        
        if count >= 100:
            from fastapi.responses import JSONResponse
            return JSONResponse(status_code=429, content={"detail": "Too Many Requests"})
            
        await redis.zadd(key, {str(current_time): current_time})
        await redis.expire(key, 60)
        
        response = await call_next(request)
        return response
