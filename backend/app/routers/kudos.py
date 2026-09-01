from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.kudos import Kudos
from app.schemas.kudos import KudosCreate, KudosResponse
from app.routers.auth import get_current_active_user
from app.models.user import User
import uuid

router = APIRouter(tags=["kudos"])

@router.post("/api/kudos", response_model=KudosResponse, status_code=201)
async def send_kudos(kudos_in: KudosCreate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    kudos = Kudos(
        from_user_id=current_user.id,
        to_user_id=kudos_in.to_user_id,
        team_id=kudos_in.team_id,
        message=kudos_in.message,
        emoji=kudos_in.emoji
    )
    db.add(kudos)
    await db.commit()
    await db.refresh(kudos)
    return kudos

@router.get("/api/teams/{team_id}/kudos", response_model=list[KudosResponse])
async def list_team_kudos(team_id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Kudos).where(Kudos.team_id == team_id))
    return result.scalars().all()
