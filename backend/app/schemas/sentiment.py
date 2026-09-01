from pydantic import BaseModel
import uuid
from datetime import datetime, date

class MessageSentimentResponse(BaseModel):
    id: uuid.UUID
    message_id: uuid.UUID
    sentiment: str
    confidence: float
    model_version: str | None
    created_at: datetime

    class Config:
        from_attributes = True

class TeamSentimentMetricResponse(BaseModel):
    id: uuid.UUID
    team_id: uuid.UUID
    date: date
    positive_count: int
    neutral_count: int
    stressed_count: int
    frustrated_count: int
    negative_count: int
    total_analyzed: int
    avg_confidence: float

    class Config:
        from_attributes = True
