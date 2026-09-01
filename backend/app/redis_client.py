import redis.asyncio as redis
from app.config import settings
from typing import Optional

class RedisClient:
    def __init__(self):
        self.redis: Optional[redis.Redis] = None

    async def connect(self):
        self.redis = redis.from_url(settings.REDIS_URL, encoding="utf8", decode_responses=True)

    async def disconnect(self):
        if self.redis:
            await self.redis.close()

    def get_client(self) -> redis.Redis:
        if not self.redis:
            raise RuntimeError("Redis client is not connected")
        return self.redis

redis_client = RedisClient()

async def get_redis():
    return redis_client.get_client()
