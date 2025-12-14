# database.py
import sqlite3
import json
import uuid
from datetime import datetime
from typing import List, Dict, Optional, Any

DB_FILE = "mindquest.db"

def get_connection():
    """Creates a connection to the SQLite database."""
    conn = sqlite3.connect(DB_FILE)
    # This allows us to access columns by name (e.g., row['email'])
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database tables if they don't exist."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            analysis TEXT
        )
    """)

    # Create Journey Table
    # Note: 'story' stores the JSON stringified history
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS journey (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            story TEXT NOT NULL
        )
    """)
    
    conn.commit()
    conn.close()

# --- User Operations ---

def create_user(name: str, email: str) -> Dict[str, Any]:
    """Creates a user (simulating the React app logic)."""
    user_id = str(uuid.uuid4())
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO users (id, name, email) VALUES (?, ?, ?)",
        (user_id, name, email)
    )
    conn.commit()
    conn.close()
    
    return {"id": user_id, "name": name, "email": email, "analysis": None}

def get_all_users() -> List[Dict[str, Any]]:
    """Retrieves all users."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    conn.close()
    
    # Convert rows to a list of dicts
    return [dict(row) for row in rows]

# --- Journey Operations ---

def create_journey(story_history: List[str]) -> Dict[str, Any]:
    """Creates a journey record."""
    record_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()
    # Serialize the list to a JSON string for storage
    story_json = json.dumps(story_history)
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO journey (id, created_at, story) VALUES (?, ?, ?)",
        (record_id, created_at, story_json)
    )
    conn.commit()
    conn.close()
    
    return {"id": record_id, "createdAt": created_at, "story": story_json}

def update_user_analysis(user_id: str, analysis: str):
    """Updates the analysis field for a specific user."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET analysis = ? WHERE id = ?",
        (analysis, user_id)
    )
    conn.commit()
    conn.close()

def get_all_journeys() -> List[Dict[str, Any]]:
    """Retrieves all journeys."""
    conn = get_connection()
    cursor = conn.cursor()
    # Map 'created_at' back to 'createdAt' to match your types
    cursor.execute("SELECT id, created_at as createdAt, story FROM journey")
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        r = dict(row)
        # We parse the JSON string back into a Python list/object
        # so the MCP tool returns actual structured data, not a string
        try:
            r['story'] = json.loads(r['story'])
        except:
            r['story'] = [] 
        results.append(r)
        
    return results