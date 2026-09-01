from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.team import Team, TeamMember
from app.schemas.team import TeamCreate, TeamResponse, TeamMemberResponse
from app.routers.auth import get_current_active_user
from app.models.user import User
import uuid
import secrets
import string

router = APIRouter(prefix="/api/teams", tags=["teams"])

def generate_invite_code(length=8):
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))

@router.get("", response_model=list[TeamResponse])
async def list_teams(current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Team).join(TeamMember).where(TeamMember.user_id == current_user.id)
    )
    return result.scalars().all()

@router.post("", response_model=TeamResponse, status_code=201)
async def create_team(team_in: TeamCreate, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    invite_code = generate_invite_code()
    team = Team(
        name=team_in.name,
        description=team_in.description,
        invite_code=invite_code,
        created_by=current_user.id
    )
    db.add(team)
    await db.flush()
    
    member = TeamMember(team_id=team.id, user_id=current_user.id, role="admin")
    db.add(member)
    await db.commit()
    await db.refresh(team)
    return team

@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(team_id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.post("/join")
async def join_team(invite_code: str, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team).where(Team.invite_code == invite_code))
    team = result.scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Invalid invite code")
        
    mem_result = await db.execute(select(TeamMember).where(TeamMember.team_id == team.id, TeamMember.user_id == current_user.id))
    if mem_result.scalar_one_or_none():
        return {"detail": "Already a member"}
        
    member = TeamMember(team_id=team.id, user_id=current_user.id, role="member")
    db.add(member)
    await db.commit()
    return {"detail": "Joined successfully", "team_id": str(team.id)}

@router.get("/{team_id}/members", response_model=list[TeamMemberResponse])
async def get_team_members(team_id: uuid.UUID, current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TeamMember).where(TeamMember.team_id == team_id))
    return result.scalars().all()
