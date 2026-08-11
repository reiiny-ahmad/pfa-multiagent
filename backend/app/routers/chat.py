import logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Conversation, Message, User
from app.schemas import MessageCreate, MessageOut, ConversationOut, QueryResponse
from app.dependencies import get_current_user
from app.agents import Orchestrator

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])

# Le pipeline multi-agents. Instancié une seule fois : les agents sont sans état,
# seul le client OpenAI (créé paresseusement) est réutilisé.
orchestrator = Orchestrator()

AGENTS_USED = ["Recherche", "Planification", "Rédaction", "Production"]


# ============================================================
# ENDPOINTS
# ============================================================

@router.post("/message", response_model=QueryResponse)
async def send_message(
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_text = payload.content

    # 1. Récupérer ou créer la conversation
    conv_id = payload.conversation_id
    if not conv_id:
        conv = Conversation(user_id=current_user.id, title=user_text[:60])
        db.add(conv)
        db.commit()
        db.refresh(conv)
        conv_id = conv.id
    else:
        conv = db.query(Conversation).filter(
            Conversation.id == conv_id,
            Conversation.user_id == current_user.id,
        ).first()
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation introuvable")

    # 2. Sauvegarder le message utilisateur
    db.add(Message(conversation_id=conv_id, role="user", content=user_text))
    db.commit()

    # 3. Exécuter le pipeline multi-agents
    logger.info("[API] Requête reçue de %s : %s", current_user.email, user_text)
    try:
        pipeline = await orchestrator.process(user_text)
        response_text = pipeline["final_response"]
    except Exception as e:
        logger.exception("[API] Échec du pipeline multi-agents")
        raise HTTPException(
            status_code=502,
            detail=f"Le pipeline multi-agents a échoué : {e}",
        )

    # 4. Sauvegarder la réponse
    assistant_msg = Message(conversation_id=conv_id, role="assistant", content=response_text)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return {
        "success": True,
        "conversation_id": conv_id,
        "query": user_text,
        "result": response_text,
        "agents_used": AGENTS_USED,
        "created_at": assistant_msg.created_at,
    }


@router.get("/conversations", response_model=List[ConversationOut])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.created_at.desc())
        .all()
    )


@router.get("/conversations/{conv_id}/messages", response_model=List[MessageOut])
def get_messages(
    conv_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = db.query(Conversation).filter(
        Conversation.id == conv_id,
        Conversation.user_id == current_user.id,
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation introuvable")
    return conv.messages


@router.delete("/conversations/{conv_id}", status_code=204)
def delete_conversation(
    conv_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conv = db.query(Conversation).filter(
        Conversation.id == conv_id,
        Conversation.user_id == current_user.id,
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation introuvable")
    db.delete(conv)  # cascade : supprime aussi les messages
    db.commit()
