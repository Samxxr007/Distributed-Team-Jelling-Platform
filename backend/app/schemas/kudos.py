from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class KudosBase(BaseModel):
    to_user_id: uuid.UUID
    team_id: uuid.UUID
    message: str
    emoji: Optional[str] = None

class KudosCreate(KudosBase):
    pass

class KudosResponse(KudosBase):
    id: uuid.UUID
    from_user_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
