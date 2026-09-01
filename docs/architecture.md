# Architecture

## System Diagram
```
+----------+      +-------------+      +-------------------+
| Frontend | <--> | Backend API | <--> | Sentiment Service |
+----------+      +-------------+      +-------------------+
                       |
                  +----------+
                  | Database |
                  +----------+
```

## Data Flow
Clients connect to Backend via REST and WebSocket.
Messages are stored in Postgres and sent to Sentiment Service.

## Layer Descriptions
- Frontend: React UI
- Backend: FastAPI
- Sentiment: HuggingFace model

## WebSocket Events
- new_message
- typing
- reaction_added

## Sentiment Pipeline
1. Message received
2. Model inferencing
3. DB update
