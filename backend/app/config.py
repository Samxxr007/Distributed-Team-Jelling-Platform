from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://jelling:jelling123@localhost:5432/jelling"
    REDIS_URL: str = "redis://localhost:6379"
    JWT_SECRET_KEY: str = "change-this-secret-key-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60
    SENTIMENT_SERVICE_URL: str = "http://localhost:8001"
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: List[str] | str = '["http://localhost:3000"]'

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        
    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            try:
                return json.loads(self.CORS_ORIGINS)
            except Exception:
                return [orig.strip() for orig in self.CORS_ORIGINS.split(',')]
        return self.CORS_ORIGINS

settings = Settings()
