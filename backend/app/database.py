import app.config  # noqa: F401  — charge les .env avant toute lecture de os.getenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

from pathlib import Path

# Chemin absolu : le fichier DB ne dépend plus du répertoire depuis lequel on
# lance uvicorn (sinon on se retrouve avec deux bases différentes).
DATA_DIR = Path(__file__).resolve().parents[1] / "data"
DATA_DIR.mkdir(exist_ok=True)

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", f"sqlite:///{DATA_DIR / 'pfa_multiagents.db'}"
)

# check_same_thread n'existe que pour SQLite
connect_args = (
    {"check_same_thread": False}
    if SQLALCHEMY_DATABASE_URL.startswith("sqlite")
    else {}
)

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()