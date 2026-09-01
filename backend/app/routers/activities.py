from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.activity import TeamActivity, ActivityParticipant
from app.schemas.activity import ActivityCreate, ActivityResponse
from app.routers.auth import get_current_active_user
from app.models.user import User
import uuid
import random

router = APIRouter(tags=["activities"])

ICEBREAKERS = [
    "If you could have any superpower, what would it be?",
    "What's your favorite way to unwind after a busy day?",
    "If you could travel anywhere in the world right now, where would you go?"
]

@router.get("/api/teams/{team_id}/activities", response_model=list[ActivityResponse])
async def list_activities(team_id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TeamActivity).where(TeamActivity.team_id == team_id))
    return result.scalars().all()

@router.post("/api/teams/{team_id}/activities", response_model=ActivityResponse, status_code=201)
async def create_activity(team_id: uuid.UUID, act_in: ActivityCreate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    act = TeamActivity(
        team_id=team_id,
        created_by=current_user.id,
        **act_in.model_dump()
    )
    db.add(act)
    await db.commit()
    await db.refresh(act)
    return act

@router.post("/api/activities/{activity_id}/join")
async def join_activity(activity_id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    part = ActivityParticipant(activity_id=activity_id, user_id=current_user.id)
    db.add(part)
    await db.commit()
    return {"detail": "Joined"}

@router.get("/api/teams/{team_id}/icebreakers")
async def get_icebreakers(team_id: uuid.UUID, current_user: User = Depends(get_current_active_user)):
    return {"questions": random.sample(ICEBREAKERS, 2)}
