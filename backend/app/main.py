import app.config  # noqa: F401  — charge les .env avant tout le reste

import logging
import os
from typing import List

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, Base, get_db
from app.routers import auth, chat, agents, tasks
from app.dependencies import get_current_user
from app.schemas import MessageCreate, ConversationOut, QueryResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Création auto des tables (le dossier data/ est créé par database.py)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PFA Multi-Agents API", version="1.0.0")

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routers
app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(agents.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")


# ============================================================
# ALIAS FRONTEND — le frontend appelle /api/query et /api/conversations
# ============================================================

@app.post("/api/query", response_model=QueryResponse, tags=["chat"])
async def api_query(
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Alias de /api/chat/message."""
    return await chat.send_message(payload, db, current_user)


@app.get("/api/conversations", response_model=List[ConversationOut], tags=["chat"])
def api_conversations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Alias de /api/chat/conversations."""
    return chat.get_conversations(db, current_user)


@app.delete("/api/conversations/{conv_id}", status_code=204, tags=["chat"])
def api_delete_conversation(
    conv_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Alias de DELETE /api/chat/conversations/{id}."""
    return chat.delete_conversation(conv_id, db, current_user)


@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok", "system": "operational"}
