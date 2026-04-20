import json

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import SurveySubmission
from database import album_exists, get_all_submissions, init_db, upsert_submission

init_db()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/submit")
async def submit_survey(data: SurveySubmission):
    upsert_submission(data)
    return {"message": "ok"}

@app.get("/check-album/{album_number}")
async def check_album(album_number: str):
    exists = album_exists(album_number)
    return { "exists": exists }


[{
  "album_number": "4233",
  "full_name": "Paweł Zawada",
  "selected_dates": ["2026-05-03", "2026-05-10", "2026-05-24"],
  "transport": "driver",
  "seats": "3"
}]

@app.get("/results")
async def get_results():
    all_submissions = get_all_submissions()
    return [{
        "album_number": user.get("album_number"),
        "full_name": user.get("full_name"),
        "selected_dates": json.loads(user.get("selected_dates")),
        "transport": user.get("transport"),
        "seats": user.get("seats"),
        } for user in all_submissions]