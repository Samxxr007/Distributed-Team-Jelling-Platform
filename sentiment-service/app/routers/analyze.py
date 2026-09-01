from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from app.schemas import AnalyzeRequest, SentimentResult, BatchAnalyzeRequest, BatchSentimentResult
from app.analyzer import ISentimentAnalyzer, DistilBertAnalyzer
from app.model import get_pipeline
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

def get_analyzer() -> ISentimentAnalyzer:
    try:
        pipeline = get_pipeline()
        return DistilBertAnalyzer(pipeline)
    except Exception as e:
        logger.error(f"Error getting analyzer: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/analyze", response_model=SentimentResult)
async def analyze_text(request: AnalyzeRequest, analyzer: ISentimentAnalyzer = Depends(get_analyzer)):
    try:
        text = request.text.strip()
        result = analyzer.analyze(text)
        return result
    except Exception as e:
        logger.error(f"Analyze error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/analyze/batch", response_model=BatchSentimentResult)
async def analyze_batch(request: BatchAnalyzeRequest, analyzer: ISentimentAnalyzer = Depends(get_analyzer)):
    try:
        results = []
        for text in request.texts:
            clean_text = text.strip()
            if not clean_text:
                results.append(analyzer.analyze("   "))
            else:
                results.append(analyzer.analyze(clean_text))
        return BatchSentimentResult(results=results)
    except Exception as e:
        logger.error(f"Batch analyze error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
