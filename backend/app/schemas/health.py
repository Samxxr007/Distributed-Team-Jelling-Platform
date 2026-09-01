from pydantic import BaseModel
import uuid
from datetime import datetime, date

class TeamHealthMetricResponse(BaseModel):
    id: uuid.UUID
    team_id: uuid.UUID
    date: date
    health_score: float
    sentiment_score: float
    engagement_score: float
    activity_score: float
    stress_ratio: float
    frustration_ratio: float
    message_count: int
    active_members: int

    class Config:
        from_attributes = True
