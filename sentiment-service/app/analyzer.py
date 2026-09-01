from abc import ABC, abstractmethod
from app.schemas import SentimentResult
from app.config import settings

class ISentimentAnalyzer(ABC):
    @abstractmethod
    def analyze(self, text: str) -> SentimentResult:
        ...

STRESS_KEYWORDS = [
    "overwhelmed", "exhausted", "burnout", "too much", "can't keep up",
    "deadline", "overloaded", "behind", "swamped", "no time",
    "pressure", "stressed", "stress", "anxious", "anxiety"
]

FRUSTRATION_KEYWORDS = [
    "frustrated", "frustrating", "annoying", "ridiculous", "absurd",
    "waste of time", "pointless", "useless", "stuck", "blocked",
    "can't do this", "nothing works", "broken", "terrible"
]

class DistilBertAnalyzer(ISentimentAnalyzer):
    def __init__(self, pipeline):
        self.pipeline = pipeline

    def analyze(self, text: str) -> SentimentResult:
        if not text or not text.strip():
            return SentimentResult(
                sentiment="neutral",
                confidence=0.5,
                raw_label="NEUTRAL",
                raw_score=0.5,
                model=settings.MODEL_NAME
            )
            
        result = self.pipeline(text)[0]
        label = result['label']
        confidence = result['score']
        
        mapped_sentiment = self._map_label(label, confidence, text)
        
        return SentimentResult(
            sentiment=mapped_sentiment,
            confidence=confidence,
            raw_label=label,
            raw_score=confidence,
            model=settings.MODEL_NAME
        )

    def _map_label(self, label: str, confidence: float, text: str) -> str:
        if label == "POSITIVE":
            if confidence >= 0.85:
                return "positive"
            else:
                return "neutral"
        elif label == "NEGATIVE":
            text_lower = text.lower()
            has_stress = any(kw in text_lower for kw in STRESS_KEYWORDS)
            has_frustration = any(kw in text_lower for kw in FRUSTRATION_KEYWORDS)
            
            if confidence < 0.60:
                return "neutral"
            elif has_stress and confidence >= 0.65:
                return "stressed"
            elif has_frustration and confidence >= 0.65:
                return "frustrated"
            elif confidence >= 0.80:
                return "negative"
            else:
                return "neutral"
        return "neutral"
