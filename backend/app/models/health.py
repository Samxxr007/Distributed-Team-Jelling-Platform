from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, DateTime, Float, Integer, Date
from sqlalchemy.sql import func
import uuid
from app.database import Base
from datetime import datetime, date

class TeamHealthMetric(Base):
    __tablename__ = "team_health_metrics"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("teams.id"), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    health_score: Mapped[float] = mapped_column(Float, default=0.0)
    sentiment_score: Mapped[float] = mapped_column(Float, default=0.0)
    engagement_score: Mapped[float] = mapped_column(Float, default=0.0)
    activity_score: Mapped[float] = mapped_column(Float, default=0.0)
    stress_ratio: Mapped[float] = mapped_column(Float, default=0.0)
    frustration_ratio: Mapped[float] = mapped_column(Float, default=0.0)
    message_count: Mapped[int] = mapped_column(Integer, default=0)
    active_members: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
