from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models.message import Message, MessageReaction
from app.schemas.message import MessageCreate, MessageResponse, ReactionCreate
from app.routers.auth import get_current_active_user
from app.models.user import User
from app.services.sentiment_service import analyze_message
import uuid

router = APIRouter(tags=["messages"])

@router.get("/api/teams/{team_id}/messages", response_model=list[MessageResponse])
async def get_team_messages(team_id: uuid.UUID, limit: int = 50, offset: int = 0, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Message).where(Message.team_id == team_id).order_by(desc(Message.created_at)).limit(limit).offset(offset)
    )
    return result.scalars().all()

@router.post("/api/messages", response_model=MessageResponse, status_code=201)
async def send_message(msg_in: MessageCreate, background_tasks: BackgroundTasks, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    msg = Message(
        content=msg_in.content,
        team_id=msg_in.team_id,
        recipient_id=msg_in.recipient_id,
        message_type=msg_in.message_type,
        reply_to_id=msg_in.reply_to_id,
        sender_id=current_user.id
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    
    if msg.team_id:
        from app.redis_client import get_redis
        redis = await get_redis()
        background_tasks.add_task(analyze_message, str(msg.id), msg.content, str(msg.team_id), str(current_user.id), db, redis)
        
    return msg

@router.post("/api/messages/{message_id}/reactions")
async def add_reaction(message_id: uuid.UUID, reaction: ReactionCreate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    r = MessageReaction(message_id=message_id, user_id=current_user.id, emoji=reaction.emoji)
    db.add(r)
    await db.commit()
    return {"detail": "Reaction added"}
