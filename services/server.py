from fastmcp import FastMCP
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from typing import List, Dict, Any

from database import init_db, get_all_users, get_all_journeys


mcp = FastMCP(name="MindQuest Data Service")

# --- UPDATED TOOLS ---

@mcp.tool()
def get_users(**kwargs) -> List[Dict[str, Any]]:
    """
    Retrieve a list of all users registered in the MindQuest database.
    Returns a list of user objects containing id, name, email, and analysis.
    """
    # **kwargs absorbs the extra timestamp/metadata n8n sends
    # so the function doesn't crash.
    users = get_all_users()
    return users

@mcp.tool()
def get_journey(**kwargs) -> List[Dict[str, Any]]:
    """
    Retrieve the full journey history records.
    Returns a list of journey objects where 'story' is the parsed history.
    """
    journeys = get_all_journeys()
    return journeys

# ---------------------

if __name__ == "__main__":
    init_db()

    mcp.run(
        transport="http",
        host="127.0.0.1",
        port=8000,
        middleware=[
            Middleware(
                CORSMiddleware,
                allow_origins=["*"],
                allow_credentials=True,
                allow_methods=["*"],
                allow_headers=["*"],
            )
        ],
    )