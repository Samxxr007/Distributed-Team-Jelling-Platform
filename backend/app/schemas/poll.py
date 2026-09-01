from pydantic import BaseModel
from typing import List, Optional
import uuid
from datetime import datetime

class PollBase(BaseModel):
    question: str
    options: List[str]
    ends_at: Optional[datetime] = None

class PollCreate(PollBase):
    pass

class PollResponse(PollBase):
    id: uuid.UUID
    team_id: uuid.UUID
    created_by: uuid.UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class PollVoteCreate(BaseModel):
    option_index: int
