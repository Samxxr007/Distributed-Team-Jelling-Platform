from sqlalchemy.ext.asyncio import AsyncSession
from app.models.sentiment import TeamSentimentMetric
from app.models.health import TeamHealthMetric
from app.models.team import TeamMember
from sqlalchemy import select, func
from datetime import date

async def calculate_health_score(team_id: str, current_date: date, db: AsyncSession):
    # Fetch sentiment metric
    sentiment_result = await db.execute(
        select(TeamSentimentMetric).where(
            TeamSentimentMetric.team_id == team_id,
            TeamSentimentMetric.date == current_date
        )
    )
    sentiment = sentiment_result.scalar_one_or_none()
    
    total = sentiment.total_analyzed if sentiment and sentiment.total_analyzed > 0 else 1
    
    pos_count = sentiment.positive_count if sentiment else 0
    neu_count = sentiment.neutral_count if sentiment else 0
    str_count = sentiment.stressed_count if sentiment else 0
    fru_count = sentiment.frustrated_count if sentiment else 0
    
    positive_ratio = pos_count / max(total, 1)
    neutral_ratio = neu_count / max(total, 1)
    stress_ratio = str_count / max(total, 1)
    frustration_ratio = fru_count / max(total, 1)
    
    sentiment_score = positive_ratio * 1.0 + neutral_ratio * 0.5 - stress_ratio * 0.8 - frustration_ratio * 0.6
    
    # Active members
    members_result = await db.execute(select(func.count(TeamMember.id)).where(TeamMember.team_id == team_id))
    team_size = members_result.scalar_one()
    active_members = total  # Simplify: assume total messages correlates to active members
    engagement_score = min(active_members / max(team_size, 1), 1.0)
    
    message_count = total
    activity_score = min(message_count / 50.0, 1.0)
    
    health_score = (
      0.35 * max(0, sentiment_score) +
      0.25 * engagement_score +
      0.20 * activity_score +
      0.10 * (1 - stress_ratio) +
      0.10 * (1 - frustration_ratio)
    ) * 100
    health_score = max(0, min(100, health_score))
    
    # Update or insert
    health_result = await db.execute(
        select(TeamHealthMetric).where(
            TeamHealthMetric.team_id == team_id,
            TeamHealthMetric.date == current_date
        )
    )
    health = health_result.scalar_one_or_none()
    if not health:
        health = TeamHealthMetric(team_id=team_id, date=current_date)
        db.add(health)
        
    health.health_score = health_score
    health.sentiment_score = sentiment_score
    health.engagement_score = engagement_score
    health.activity_score = activity_score
    health.stress_ratio = stress_ratio
    health.frustration_ratio = frustration_ratio
    health.message_count = message_count
    health.active_members = active_members
    
    await db.commit()
    return health
