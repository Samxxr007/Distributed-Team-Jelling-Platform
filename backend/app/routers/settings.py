from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.consent import ConsentSetting
from app.schemas.consent import ConsentResponse, ConsentUpdate
from app.routers.auth import get_current_active_user
from app.models.user import User

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/consent", response_model=ConsentResponse)
async def get_consent(current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ConsentSetting).where(ConsentSetting.user_id == current_user.id))
    consent = result.scalar_one_or_none()
    if not consent:
        consent = ConsentSetting(user_id=current_user.id)
        db.add(consent)
        await db.commit()
        await db.refresh(consent)
    return consent

@router.put("/consent", response_model=ConsentResponse)
async def update_consent(update_in: ConsentUpdate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ConsentSetting).where(ConsentSetting.user_id == current_user.id))
    consent = result.scalar_one_or_none()
    if not consent:
        consent = ConsentSetting(user_id=current_user.id)
        db.add(consent)
    
    consent.sentiment_analysis_enabled = update_in.sentiment_analysis_enabled
    consent.data_retention_days = update_in.data_retention_days
    
    await db.commit()
    await db.refresh(consent)
    return consent
