from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models.sentiment import TeamSentimentMetric
from app.schemas.sentiment import TeamSentimentMetricResponse
from app.routers.auth import get_current_active_user
from app.models.user import User
import uuid

router = APIRouter(prefix="/api", tags=["sentiment"])

@router.get("/teams/{team_id}/sentiment", response_model=list[TeamSentimentMetricResponse])
async def get_team_sentiment(team_id: uuid.UUID, limit: int = 30, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TeamSentimentMetric)
        .where(TeamSentimentMetric.team_id == team_id)
        .order_by(desc(TeamSentimentMetric.date))
        .limit(limit)
    )
    return result.scalars().all()
