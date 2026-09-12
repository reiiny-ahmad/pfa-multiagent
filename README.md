# 🤖 PFA Multi-Agents — AI Web Interface - yl

End-of-year project (PFA) completed during an internship at SNRT.  
Development of a web interface connected to a multi-agent system based on artificial intelligence.

---

## 📋 Topic

Develop an interface allowing a user to enter a request in **natural language** (e.g., *"Women's Africa Cup of Nations in Morocco"*). This request is handled by a multi-agent system:

- **Main Agent (Orchestrator)**: analyzes the query, decomposes it into sub-tasks
- **Research Agent**: collects relevant information
- **Planning Agent**: organizes processing
- **Writing Agent**: synthesizes the final response

---

## 🏗️ Architecture

```
┌─────────────┐      HTTP       ┌─────────────┐
│   Frontend  │ ◄──────────────► │   Backend   │
│   (React)   │                  │  (FastAPI)  │
│  localhost  │                  │  localhost  │
│   :5173     │                  │   :8000     │
└─────────────┘                  └──────┬──────┘
                                        │
                         ┌──────────────┴──────────────┐
                         │         Multi-Agents         │
                         │  ┌─────────────────────┐    │
                         │  │    Orchestrator      │    │
                         │  └──────────┬──────────┘    │
                         │             │                │
                         │        ┌────┴────┐           │
                         │        ▼         ▼           │
                         │     ┌─────┐   ┌─────┐        │
                         │     │Res. │   │Plan.│        │
                         │     └─────┘   └─────┘        │
                         │        ▼                     │
                         │     ┌─────┐                  │
                         │     │Writ.│                  │
                         │     └─────┘                  │
                         └─────────────────────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────┐
                         │         SQLite           │
                         │       (history)          │
                         └─────────────────────────┘
                                        │
                                        ▼
                         ┌─────────────────────────┐
                         │      Telegram Bot        │
                         │  (user communication)    │
                         └─────────────────────────┘
```

---

## 🚀 Technologies Used

| Layer | Technology | Role |
|-------|------------|------|
| Frontend | React + Vite | User interface |
| Backend | FastAPI (Python) | REST API |
| Database | SQLite | Conversation persistence |
| Multi-agents | Modular Python architecture | AI processing |
| Communication | Telegram Bot | Alternative user channel |
| Containerization | Docker + Docker Compose | Deployment |

---

## ⚡ Quick Start

### Prerequisites
- [Docker](https://www.docker.com/) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### Launch with Docker

```bash
git clone <repo-url>
cd PFA_MultiAgents

# Create the .env file from the example
cp .env.example .env
# Then edit .env: set OPENAI_API_KEY and your Telegram token

# Launch the containers
docker-compose up --build
```

### Launch locally (without Docker)

Two terminals are needed.

```bash
# Terminal 1 — backend (run from the backend/ directory)
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows  (source .venv/bin/activate on Linux/macOS)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

```bash
# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173 — you will land on the login page. Create an
account via **S'inscrire**; you are logged in straight away.

### LLM configuration

The agents call an OpenAI-compatible API. Without a valid key they still work,
but each agent returns a **built-in mock response** (useful for demos offline).
To get real answers, set in the root `.env`:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
# OPENAI_BASE_URL=...   # optional: Azure, Together.ai, any compatible endpoint
```

### Access

| Service | URL |
|---------|-----|
| Web interface | http://localhost:5173 |
| API documentation | http://localhost:8000/docs |
| Telegram Bot | @pfa_multiagents_bot |

---

## 📁 Project Structure

```
PFA_MultiAgents/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   ├── Dockerfile
│   └── package.json
├── backend/               # FastAPI
│   ├── app/
│   │   ├── main.py        # App setup + frontend route aliases
│   │   ├── config.py      # .env loading (imported first)
│   │   ├── database.py    # SQLite connection
│   │   ├── models.py      # SQLAlchemy models
│   │   ├── schemas.py     # Pydantic schemas
│   │   ├── auth_utils.py  # Password hashing + JWT
│   │   ├── dependencies.py # get_current_user
│   │   ├── telegram_bot.py # Telegram bot
│   │   ├── routers/       # auth, chat, agents, tasks
│   │   └── agents/        # AI agents
│   │       ├── base.py
│   │       ├── orchestrator.py
│   │       ├── research_agent.py
│   │       ├── planning_agent.py
│   │       ├── writing_agent.py
│   │       └── production_agent.py
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🎯 Features

- ✅ Natural language request input
- ✅ Modular multi-agent architecture (Research → Planning → Writing → Production)
- ✅ User authentication (JWT) with per-user history isolation
- ✅ Persistent conversation history (SQLite)
- ✅ Responsive interface with sidebar
- ✅ Integrated Telegram bot
- ✅ Auto-generated API documentation (Swagger)
- ✅ Full Docker containerization
- ✅ Offline mock mode when no API key is configured

---

## 🔮 Future Evolution

- [ ] Integration of Sakana Fugu for AI agents
- [ ] PostgreSQL database in production
- [ ] Cloud deployment (AWS / Azure)
- [ ] Unit and integration tests
- [ ] Streaming responses (agent-by-agent progress)

---

## 👤 Author

**Faris Hamada** — 4th year Data & AI student at HESTIM  
Internship at **SNRT** (National Broadcasting and Television Company)

---

## 📄 License

Academic project — All rights reserved.
