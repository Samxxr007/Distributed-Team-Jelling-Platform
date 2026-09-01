from pydantic import BaseModel
import uuid
from datetime import datetime

class ConsentUpdate(BaseModel):
    sentiment_analysis_enabled: bool
    data_retention_days: int

class ConsentResponse(ConsentUpdate):
    id: uuid.UUID
    user_id: uuid.UUID
    updated_at: datetime

    class Config:
        from_attributes = True
