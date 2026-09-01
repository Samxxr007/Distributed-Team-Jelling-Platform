from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, DateTime, Boolean, Integer
from sqlalchemy.sql import func
import uuid
from app.database import Base
from datetime import datetime

class ConsentSetting(Base):
    __tablename__ = "consent_settings"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    sentiment_analysis_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    data_retention_days: Mapped[int] = mapped_column(Integer, default=90)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
