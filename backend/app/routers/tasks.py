from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskResponse, TaskStatusUpdate
from app.routers.auth import get_current_active_user
from app.models.user import User
from datetime import datetime, timezone
import uuid

router = APIRouter(tags=["tasks"])

@router.get("/api/teams/{team_id}/tasks", response_model=list[TaskResponse])
async def list_tasks(team_id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.team_id == team_id))
    return result.scalars().all()

@router.post("/api/teams/{team_id}/tasks", response_model=TaskResponse, status_code=201)
async def create_task(team_id: uuid.UUID, task_in: TaskCreate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    task = Task(
        team_id=team_id,
        created_by=current_user.id,
        **task_in.model_dump()
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

@router.patch("/api/tasks/{task_id}/status", response_model=TaskResponse)
async def update_task_status(task_id: uuid.UUID, update_in: TaskStatusUpdate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task.status = update_in.status
    if task.status == 'done':
        task.completed_at = datetime.now(timezone.utc)
    else:
        task.completed_at = None
        
    await db.commit()
    await db.refresh(task)
    return task
