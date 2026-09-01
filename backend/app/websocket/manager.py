from typing import Dict, Any
from fastapi import WebSocket
import json

class ConnectionManager:
    def __init__(self):
        # team_id -> user_id -> WebSocket
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, websocket: WebSocket, team_id: str, user_id: str):
        await websocket.accept()
        if team_id not in self.active_connections:
            self.active_connections[team_id] = {}
        self.active_connections[team_id][user_id] = websocket

    def disconnect(self, websocket: WebSocket, team_id: str, user_id: str):
        if team_id in self.active_connections:
            if user_id in self.active_connections[team_id]:
                del self.active_connections[team_id][user_id]
            if not self.active_connections[team_id]:
                del self.active_connections[team_id]

    async def broadcast_to_team(self, team_id: str, event_type: str, data: Any):
        if team_id in self.active_connections:
            message = json.dumps({"type": event_type, "data": data})
            for connection in self.active_connections[team_id].values():
                await connection.send_text(message)

    async def send_to_user(self, user_id: str, event_type: str, data: Any):
        message = json.dumps({"type": event_type, "data": data})
        for team_connections in self.active_connections.values():
            if user_id in team_connections:
                await team_connections[user_id].send_text(message)

manager = ConnectionManager()
