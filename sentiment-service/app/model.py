from transformers import pipeline, Pipeline
from typing import Optional
import time
import logging

logger = logging.getLogger(__name__)

_pipeline: Optional[Pipeline] = None

def load_model(model_name: str, cache_dir: str) -> Pipeline:
    """Load the HuggingFace sentiment pipeline. Called once at startup."""
    start_time = time.time()
    logger.info(f"Loading model {model_name}...")
    p = pipeline(
        "sentiment-analysis",
        model=model_name,
        model_kwargs={"cache_dir": cache_dir},
        truncation=True,
        max_length=512,
    )
    load_time = time.time() - start_time
    logger.info(f"Model loaded in {load_time:.2f} seconds.")
    return p

def get_pipeline() -> Pipeline:
    global _pipeline
    if _pipeline is None:
        raise RuntimeError("Model not loaded")
    return _pipeline

def set_pipeline(p: Pipeline):
    global _pipeline
    _pipeline = p
