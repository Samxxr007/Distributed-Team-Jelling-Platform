from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class NotificationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    body: str
    notification_type: str
    reference_id: Optional[uuid.UUID]
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
