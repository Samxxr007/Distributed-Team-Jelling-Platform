from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.task import Task
from datetime import datetime, timedelta

async def get_productivity_metrics(team_id: str, days: int, db: AsyncSession):
    cutoff_date = datetime.now() - timedelta(days=days)
    
    result = await db.execute(
        select(
            func.sum(func.cast(Task.status == 'done', func.Integer())).label('completed'),
            func.sum(func.cast(Task.status == 'todo', func.Integer())).label('pending'),
            func.sum(func.cast(Task.status == 'in_progress', func.Integer())).label('in_progress')
        ).where(Task.team_id == team_id)
    )
    
    stats = result.first()
    completed = stats.completed or 0
    pending = stats.pending or 0
    in_progress = stats.in_progress or 0
    total = completed + pending + in_progress
    
    completion_rate = completed / total if total > 0 else 0
    
    return {
        "tasks_completed": completed,
        "tasks_pending": pending,
        "tasks_in_progress": in_progress,
        "completion_rate": completion_rate,
        "avg_completion_time": 0,
        "top_contributors": [],
        "collaboration_score": 0,
        "daily_activity": []
    }
