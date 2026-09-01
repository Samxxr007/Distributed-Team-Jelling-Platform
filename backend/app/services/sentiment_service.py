import httpx
import json
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.sentiment import MessageSentiment, TeamSentimentMetric
from app.models.consent import ConsentSetting
from app.models.message import Message
from app.config import settings
from datetime import date
from sqlalchemy import select
from app.services.health_service import calculate_health_score
from app.websocket.manager import manager

async def analyze_message(message_id: str, content: str, team_id: str, sender_id: str, db: AsyncSession, redis):
    # 1. Check consent settings
    consent_result = await db.execute(select(ConsentSetting).where(ConsentSetting.user_id == sender_id))
    consent = consent_result.scalar_one_or_none()
    if consent and not consent.sentiment_analysis_enabled:
        return
        
    # 2. Call sentiment service
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.SENTIMENT_SERVICE_URL}/analyze", 
                json={"text": content}
            )
            data = response.json()
    except Exception as e:
        print(f"Error calling sentiment service: {e}")
        return

    # 3 & 4. Save message sentiment
    sentiment = MessageSentiment(
        message_id=message_id,
        sentiment=data.get("sentiment", "neutral"),
        confidence=data.get("confidence", 0.0),
        model_version=data.get("model", "v1")
    )
    db.add(sentiment)
    
    # 5. Update team sentiment metrics
    today = date.today()
    metric_result = await db.execute(
        select(TeamSentimentMetric).where(
            TeamSentimentMetric.team_id == team_id,
            TeamSentimentMetric.date == today
        )
    )
    metric = metric_result.scalar_one_or_none()
    if not metric:
        metric = TeamSentimentMetric(team_id=team_id, date=today)
        db.add(metric)
        
    metric.total_analyzed += 1
    metric.avg_confidence = ((metric.avg_confidence * (metric.total_analyzed - 1)) + sentiment.confidence) / metric.total_analyzed
    
    setattr(metric, f"{sentiment.sentiment}_count", getattr(metric, f"{sentiment.sentiment}_count") + 1)
    await db.commit()

    # 6. Recalculate health
    await calculate_health_score(team_id, today, db)
    
    # 7. WebSocket broadcast
    await manager.broadcast_to_team(str(team_id), "sentiment:update", {"message_id": str(message_id), "sentiment": sentiment.sentiment})
