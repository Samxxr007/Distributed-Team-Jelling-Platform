from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_db
from app.models.message import Message, MessageReaction
from app.models.sentiment import MessageSentiment
from app.schemas.message import MessageCreate, MessageResponse, ReactionCreate
from app.routers.auth import get_current_active_user
from app.models.user import User
from app.services.sentiment_service import analyze_message
from app.websocket.manager import manager
import uuid

router = APIRouter(tags=["messages"])

@router.get("/api/teams/{team_id}/messages", response_model=list[MessageResponse])
async def get_team_messages(team_id: uuid.UUID, limit: int = 50, offset: int = 0, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Message, User, MessageSentiment)
        .join(User, Message.sender_id == User.id)
        .outerjoin(MessageSentiment, Message.id == MessageSentiment.message_id)
        .where(Message.team_id == team_id)
        .order_by(Message.created_at.asc())
        .limit(limit)
        .offset(offset)
    )
    rows = result.all()
    
    responses = []
    for msg, sender, sent in rows:
        resp = MessageResponse(
            id=msg.id,
            team_id=msg.team_id,
            sender_id=msg.sender_id,
            sender_name=sender.full_name or sender.username,
            sender_avatar=sender.avatar_url,
            content=msg.content,
            message_type=msg.message_type or "team",
            reply_to_id=msg.reply_to_id,
            recipient_id=msg.recipient_id,
            sentiment=sent.sentiment if sent else None,
            sentiment_confidence=sent.confidence if sent else None,
            created_at=msg.created_at,
            updated_at=msg.updated_at
        )
        responses.append(resp)
    return responses

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
    
    sender_name = current_user.full_name or current_user.username
    sender_avatar = current_user.avatar_url

    if msg.team_id:
        from app.redis_client import get_redis
        redis = await get_redis()
        background_tasks.add_task(analyze_message, str(msg.id), msg.content, str(msg.team_id), str(current_user.id), db, redis)
        
        # Broadcast message:new over WebSocket
        await manager.broadcast_to_team(
            str(msg.team_id),
            "message:new",
            {
                "id": str(msg.id),
                "team_id": str(msg.team_id),
                "sender_id": str(msg.sender_id),
                "sender_name": sender_name,
                "sender_avatar": sender_avatar,
                "content": msg.content,
                "message_type": msg.message_type,
                "created_at": msg.created_at.isoformat(),
                "sentiment": None
            }
        )
        
    return MessageResponse(
        id=msg.id,
        team_id=msg.team_id,
        sender_id=msg.sender_id,
        sender_name=sender_name,
        sender_avatar=sender_avatar,
        content=msg.content,
        message_type=msg.message_type,
        reply_to_id=msg.reply_to_id,
        recipient_id=msg.recipient_id,
        sentiment=None,
        created_at=msg.created_at,
        updated_at=msg.updated_at
    )

@router.post("/api/messages/{message_id}/reactions")
async def add_reaction(message_id: uuid.UUID, reaction: ReactionCreate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    r = MessageReaction(message_id=message_id, user_id=current_user.id, emoji=reaction.emoji)
    db.add(r)
    await db.commit()
    return {"detail": "Reaction added"}

