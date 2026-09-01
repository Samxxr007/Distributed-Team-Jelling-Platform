from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    activity_type: str
    scheduled_at: Optional[datetime] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: uuid.UUID
    team_id: uuid.UUID
    created_by: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
