from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.health import TeamHealthMetric
from pydantic import BaseModel
from datetime import date, timedelta

class NudgeMessage(BaseModel):
    message: str

async def generate_nudges(team_id: str, db: AsyncSession) -> list[NudgeMessage]:
    today = date.today()
    three_days_ago = today - timedelta(days=3)
    
    result = await db.execute(
        select(TeamHealthMetric)
        .where(TeamHealthMetric.team_id == team_id, TeamHealthMetric.date >= three_days_ago)
        .order_by(desc(TeamHealthMetric.date))
    )
    metrics = result.scalars().all()
    
    nudges = []
    if not metrics:
        nudges.append(NudgeMessage(message="Team communication has been quiet. Consider scheduling a team check-in."))
        return nudges

    latest = metrics[0]
    
    if len(metrics) >= 3 and metrics[-1].health_score - latest.health_score > 10:
        nudges.append(NudgeMessage(message="Team sentiment has declined over the last 3 days. Consider checking in with the team."))
        
    if latest.stress_ratio > 0.30:
        nudges.append(NudgeMessage(message="Stress indicators are elevated. Consider reviewing workload distribution."))
        
    if latest.frustration_ratio > 0.25:
        nudges.append(NudgeMessage(message="Frustration signals detected. Consider a team retrospective."))
        
    positive_ratio = latest.sentiment_score # simplified
    if positive_ratio > 0.70 and latest.message_count > 20:
        nudges.append(NudgeMessage(message="Team morale is strong! Consider recognizing recent achievements."))
        
    if latest.message_count == 0:
        nudges.append(NudgeMessage(message="Team communication has been quiet. Consider scheduling a team check-in."))
        
    return nudges
