from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Agent, User
from app.schemas import AgentCreate, AgentOut
from app.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/agents", tags=["agents"])

@router.get("/", response_model=List[AgentOut])
def list_agents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Retourne les agents globaux + ceux de l'utilisateur
    agents = db.query(Agent).filter(
        (Agent.user_id == current_user.id) | (Agent.user_id == None)
    ).all()
    
    # Si aucun agent, en créer des par défaut (évite liste vide)
    if not agents:
        defaults = [
            Agent(name="Orchestrateur", agent_type="orchestrateur", description="Coordonne tous les agents IA", user_id=None),
            Agent(name="Recherche", agent_type="recherche", description="Recherche et analyse de données", user_id=None),
            Agent(name="Planification", agent_type="planification", description="Organise et planifie les projets", user_id=None),
            Agent(name="Rédaction", agent_type="redaction", description="Génère du contenu professionnel", user_id=None),
        ]
        for a in defaults:
            db.add(a)
        db.commit()
        agents = db.query(Agent).filter(Agent.user_id == None).all()
    
    return agents

@router.post("/", response_model=AgentOut)
def create_agent(payload: AgentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = Agent(**payload.model_dump(), user_id=current_user.id)
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent