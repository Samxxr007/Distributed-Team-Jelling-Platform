from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.team import Team
from app.schemas.auth import UserResponse
from app.schemas.team import TeamResponse
from app.routers.auth import get_current_active_user
import uuid

router = APIRouter(prefix="/api/admin", tags=["admin"])

async def require_admin(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/users", response_model=list[UserResponse])
async def list_all_users(admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()

@router.get("/teams", response_model=list[TeamResponse])
async def list_all_teams(admin: User = Depends(require_admin), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team))
    return result.scalars().all()
