# Energylandia Survey

A simple survey form for our university Energylandia trip.

**Tech:** React + TypeScript + Vite (frontend), FastAPI (backend), SQLite (database), Docker Compose.

## Quick start

```bash
docker compose up --build
```

- Frontend: http://localhost:3001
- Backend: http://localhost:8001

## Local dev

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
```

## API

- `POST /submit` — submit survey
- `GET /check-album/{id}` — check if album exists
- `GET /results` — list all submissions
