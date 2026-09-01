from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from prometheus_fastapi_instrumentator import Instrumentator
import logging

from app.config import settings
from app.model import load_model, set_pipeline, _pipeline
from app.routers import analyze

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up application...")
    try:
        pipeline = load_model(settings.MODEL_NAME, settings.MODEL_CACHE_DIR)
        set_pipeline(pipeline)
        logger.info("Application startup complete.")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
    yield
    logger.info("Shutting down application...")

app = FastAPI(title="Sentiment Analysis Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Instrumentator().instrument(app).expose(app, endpoint="/metrics")

app.include_router(analyze.router)

@app.get("/health")
async def health_check():
    # Access _pipeline directly since get_pipeline() raises an error if not loaded
    from app.model import _pipeline
    model_loaded = _pipeline is not None
    return {
        "status": "ok",
        "model_loaded": model_loaded,
        "model_name": settings.MODEL_NAME
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
