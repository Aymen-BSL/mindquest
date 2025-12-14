# api.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import database

# Initialize DB tables
database.init_db()

app = FastAPI()

# Allow your React app (usually localhost:3000 or 5173) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class UserCreate(BaseModel):
    name: str
    email: str

class AnalysisUpdate(BaseModel):
    analysis: str

class JourneyCreate(BaseModel):
    story: List[str]

# --- Endpoints ---

@app.post("/users")
def create_user(user: UserCreate):
    return database.create_user(user.name, user.email)

@app.get("/users/first")
def get_first_user():
    """
    Simulates the single-player behavior. 
    Returns the first user found or null if empty.
    """
    users = database.get_all_users()
    if users:
        return users[0]
    return None

@app.put("/users/{user_id}/analysis")
def update_analysis(user_id: str, data: AnalysisUpdate):
    database.update_user_analysis(user_id, data.analysis)
    return {"status": "success"}

@app.post("/journeys")
def create_journey(journey: JourneyCreate):
    return database.create_journey(journey.story)

if __name__ == "__main__":
    import uvicorn
    # Run on port 8080 to avoid conflict with MCP (usually 8000)
    uvicorn.run(app, host="0.0.0.0", port=8080)