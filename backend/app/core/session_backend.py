from fastapi import Depends, HTTPException, status, APIRouter, Response, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from app.core.security import pwd_context
from app.db.database import connect_user
import uuid

security = HTTPBasic()
user_collection = connect_user()
# In-memory session storage
sessions = {}


def create_session(username):
    session_id = str(uuid.uuid4())
    user_data = user_collection.find_one({"username": username})
    sessions[session_id] = user_data['username']  # Store user data directly
    return session_id


def get_user_from_session(session_id: str):
    username = sessions[session_id]
    if username:
        user = user_collection.find_one({"username": username}, {'_id': 0})
        return user
    return None
