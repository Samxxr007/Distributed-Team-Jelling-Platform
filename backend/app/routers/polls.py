from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.poll import Poll, PollVote
from app.schemas.poll import PollCreate, PollResponse, PollVoteCreate
from app.routers.auth import get_current_active_user
from app.models.user import User
import uuid

router = APIRouter(tags=["polls"])

@router.get("/api/teams/{team_id}/polls", response_model=list[PollResponse])
async def list_polls(team_id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Poll).where(Poll.team_id == team_id))
    return result.scalars().all()

@router.post("/api/teams/{team_id}/polls", response_model=PollResponse, status_code=201)
async def create_poll(team_id: uuid.UUID, poll_in: PollCreate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    poll = Poll(
        team_id=team_id,
        created_by=current_user.id,
        question=poll_in.question,
        options=poll_in.options,
        ends_at=poll_in.ends_at
    )
    db.add(poll)
    await db.commit()
    await db.refresh(poll)
    return poll

@router.post("/api/polls/{poll_id}/vote")
async def vote_poll(poll_id: uuid.UUID, vote_in: PollVoteCreate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Poll).where(Poll.id == poll_id))
    poll = result.scalar_one_or_none()
    if not poll or not poll.is_active:
        raise HTTPException(status_code=400, detail="Poll not active or not found")
        
    vote_result = await db.execute(select(PollVote).where(PollVote.poll_id == poll_id, PollVote.user_id == current_user.id))
    if vote_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already voted")
        
    vote = PollVote(poll_id=poll_id, user_id=current_user.id, option_index=vote_in.option_index)
    db.add(vote)
    await db.commit()
    return {"detail": "Vote recorded"}
