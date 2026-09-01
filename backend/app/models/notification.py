from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
import uuid
from app.database import Base
from datetime import datetime

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    body: Mapped[str] = mapped_column(String, nullable=False)
    notification_type: Mapped[str] = mapped_column(String, nullable=False) # message, invite, poll, kudos, activity, nudge, health
    reference_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=True) # Or any other entity
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
