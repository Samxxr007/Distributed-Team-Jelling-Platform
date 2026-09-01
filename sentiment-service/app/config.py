from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MODEL_NAME: str = "distilbert-base-uncased-finetuned-sst-2-english"
    MODEL_CACHE_DIR: str = "/app/model_cache"
    MAX_TEXT_LENGTH: int = 512
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"

settings = Settings()
