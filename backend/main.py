from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import SurveySubmission
from database import init_db, upsert_submission

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
    print(data)
    return {"message": "ok"}