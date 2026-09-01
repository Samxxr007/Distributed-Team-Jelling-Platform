from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.security import OAuth2PasswordBearer
from app.database import get_db
from app.models.user import User
from app.models.consent import ConsentSetting
from app.schemas.auth import UserCreate, UserResponse, TokenWithUser, UserUpdate, UserLogin
from app.utils.password import verify_password, get_password_hash
from app.utils.jwt import create_access_token, verify_token
from app.redis_client import get_redis
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = verify_token(token)
    redis = await get_redis()
    if await redis.get(f"blacklist:{token}"):
        raise HTTPException(status_code=401, detail="Token has been revoked")
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def require_role(*roles: str):
    """Dependency factory for role-based access control."""
    async def role_checker(current_user: User = Depends(get_current_active_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker


@router.post("/register", response_model=TokenWithUser, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where((User.email == user_in.email) | (User.username == user_in.username))
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email or username already registered")

    hashed_pw = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        avatar_url=user_in.avatar_url,
    )
    db.add(user)
    await db.flush()

    consent = ConsentSetting(user_id=user.id)
    db.add(consent)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.post("/login", response_model=TokenWithUser)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """JSON body login — accepts email or username in the 'email' field."""
    result = await db.execute(
        select(User).where((User.email == credentials.email) | (User.username == credentials.email))
    )
    user = result.scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is inactive")

    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer", "user": user}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
async def update_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    if user_in.email:
        current_user.email = user_in.email
    if user_in.full_name:
        current_user.full_name = user_in.full_name
    if user_in.avatar_url:
        current_user.avatar_url = user_in.avatar_url
    await db.commit()
    await db.refresh(current_user)
    return current_user


@router.post("/logout", status_code=204)
async def logout(token: str = Depends(oauth2_scheme)):
    if token:
        redis = await get_redis()
        await redis.setex(f"blacklist:{token}", 3600, "1")
    return None
