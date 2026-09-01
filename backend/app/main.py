from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base
from app.redis_client import redis_client
from app.middleware.logging import LoggingMiddleware
from app.middleware.auth import RateLimitMiddleware
from app.websocket.manager import manager
from app.utils.jwt import verify_token

from app.routers import (
    auth_router, teams_router, messages_router, sentiment_router,
    health_router, tasks_router, polls_router, kudos_router,
    activities_router, notifications_router, admin_router, settings_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await redis_client.connect()
    
    yield
    
    # Shutdown
    await redis_client.disconnect()
    await engine.dispose()

app = FastAPI(title="Jelling Environment API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(LoggingMiddleware)

Instrumentator().instrument(app).expose(app)

app.include_router(auth_router)
app.include_router(teams_router)
app.include_router(messages_router)
app.include_router(sentiment_router)
app.include_router(health_router)
app.include_router(tasks_router)
app.include_router(polls_router)
app.include_router(kudos_router)
app.include_router(activities_router)
app.include_router(notifications_router)
app.include_router(admin_router)
app.include_router(settings_router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}

@app.websocket("/ws/team/{team_id}")
async def websocket_endpoint(websocket: WebSocket, team_id: str, token: str):
    try:
        user_id = verify_token(token)
        # Should verify if user is in team, skipping for brevity
        await manager.connect(websocket, team_id, user_id)
        
        while True:
            data = await websocket.receive_text()
            # Handle incoming events (e.g., typing)
            await manager.broadcast_to_team(team_id, "message:typing", {"user_id": user_id})
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, team_id, user_id)
    except Exception as e:
        await websocket.close()
