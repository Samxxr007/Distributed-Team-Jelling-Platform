from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime

class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(TeamBase):
    pass

class TeamResponse(TeamBase):
    id: uuid.UUID
    invite_code: str
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TeamMemberResponse(BaseModel):
    id: uuid.UUID
    team_id: uuid.UUID
    user_id: uuid.UUID
    role: str
    joined_at: datetime

    class Config:
        from_attributes = True
