from pydantic import BaseModel, Field
from typing import List

class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000)
    
class SentimentResult(BaseModel):
    sentiment: str  # positive | neutral | stressed | frustrated | negative
    confidence: float  # 0.0 - 1.0
    raw_label: str  # POSITIVE or NEGATIVE from model
    raw_score: float  # raw model confidence
    model: str  # model version string
    
class BatchAnalyzeRequest(BaseModel):
    texts: List[str] = Field(..., max_length=50)
    
class BatchSentimentResult(BaseModel):
    results: List[SentimentResult]
