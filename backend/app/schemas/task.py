from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "todo"
    priority: str = "medium"
    assigned_to: Optional[uuid.UUID] = None
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskStatusUpdate(BaseModel):
    status: str

class TaskResponse(TaskBase):
    id: uuid.UUID
    team_id: uuid.UUID
    created_by: uuid.UUID
    completed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
