from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class MessageBase(BaseModel):
    content: str
    message_type: str = "team"
    reply_to_id: Optional[uuid.UUID] = None
    team_id: Optional[uuid.UUID] = None
    recipient_id: Optional[uuid.UUID] = None

class MessageCreate(MessageBase):
    pass

class MessageSentimentInfo(BaseModel):
    sentiment: str
    confidence: float

class MessageResponse(MessageBase):
    id: uuid.UUID
    sender_id: uuid.UUID
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None
    sentiment: Optional[str] = None
    sentiment_confidence: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReactionCreate(BaseModel):
    emoji: str

