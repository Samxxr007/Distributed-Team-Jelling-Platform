from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models.health import TeamHealthMetric
from app.schemas.health import TeamHealthMetricResponse
from app.routers.auth import get_current_active_user
from app.models.user import User
from app.services.nudge_service import generate_nudges
import uuid
from datetime import date

router = APIRouter(prefix="/api/teams", tags=["health"])

@router.get("/{team_id}/health", response_model=TeamHealthMetricResponse)
async def get_team_health(team_id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TeamHealthMetric)
        .where(TeamHealthMetric.team_id == team_id, TeamHealthMetric.date == date.today())
    )
    metric = result.scalar_one_or_none()
    if not metric:
        from app.services.health_service import calculate_health_score
        metric = await calculate_health_score(str(team_id), date.today(), db)
    return metric

@router.get("/{team_id}/nudges")
async def get_team_nudges(team_id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    nudges = await generate_nudges(str(team_id), db)
    return nudges
