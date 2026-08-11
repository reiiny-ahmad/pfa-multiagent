from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Task, Agent, User
from app.schemas import TaskCreate, TaskOut, DashboardStats
from app.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=List[TaskOut])
def list_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Task).filter(Task.user_id == current_user.id).all()

@router.post("/", response_model=TaskOut)
def create_task(payload: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = Task(**payload.model_dump(), user_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/stats/dashboard", response_model=DashboardStats)
def dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total = db.query(Task).filter(Task.user_id == current_user.id).count()
    completed = db.query(Task).filter(Task.user_id == current_user.id, Task.status == "termine").count()
    pending = db.query(Task).filter(Task.user_id == current_user.id, Task.status == "en_attente").count()
    active_agents = db.query(Agent).filter(Agent.is_active == True).count()
    return {
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": pending,
        "active_agents": active_agents or 4
    }