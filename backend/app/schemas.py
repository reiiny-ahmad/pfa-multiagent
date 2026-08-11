from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional, List
from datetime import datetime

# Auth
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    is_active: bool
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Chat
class MessageCreate(BaseModel):
    conversation_id: Optional[int] = None
    # Le frontend historique envoie {"query": ...}, le nouveau {"content": ...}.
    # On accepte les deux pour ne casser aucun des deux appelants.
    content: Optional[str] = None
    query: Optional[str] = None

    @model_validator(mode="after")
    def _require_text(self):
        text = (self.content or self.query or "").strip()
        if not text:
            raise ValueError("Le champ 'content' (ou 'query') est requis")
        self.content = text
        return self

class QueryResponse(BaseModel):
    """Réponse du pipeline multi-agents, format attendu par App.jsx."""
    success: bool = True
    conversation_id: int
    query: str
    result: str
    agents_used: List[str] = []
    created_at: Optional[datetime] = None

class MessageOut(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime
    class Config:
        from_attributes = True

class ConversationOut(BaseModel):
    id: int
    title: str
    created_at: datetime
    messages: List[MessageOut] = []
    class Config:
        from_attributes = True

# Agents
class AgentCreate(BaseModel):
    name: str
    agent_type: str
    description: Optional[str] = None

class AgentOut(BaseModel):
    id: int
    name: str
    agent_type: str
    description: Optional[str] = None
    is_active: bool
    class Config:
        from_attributes = True

# Tasks
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    agent_type: Optional[str] = None

class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    agent_type: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Dashboard stats
class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    active_agents: int