from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.database import get_db
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse
from app.routers.auth import get_current_active_user
from app.models.user import User
import uuid

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

@router.get("", response_model=list[NotificationResponse])
async def list_notifications(current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Notification).where(Notification.user_id == current_user.id))
    return result.scalars().all()

@router.patch("/{id}/read")
async def mark_read(id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    await db.execute(
        update(Notification).where(Notification.id == id, Notification.user_id == current_user.id).values(is_read=True)
    )
    await db.commit()
    return {"detail": "Marked as read"}

@router.patch("/read-all")
async def mark_all_read(current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    await db.execute(
        update(Notification).where(Notification.user_id == current_user.id).values(is_read=True)
    )
    await db.commit()
    return {"detail": "All marked as read"}
