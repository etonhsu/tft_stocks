from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Form, Cookie
from fastapi.security import HTTPBasicCredentials
import logging
import json

from app.core.security import pwd_context
from app.core.session_backend import security, create_session, sessions
from app.db.database import connect_user

router = APIRouter()
user_collection = connect_user()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/login")
async def login(response: Response, username='testuser'):
    with open("login_data.json", "w") as file:
        json.dump({"username": username}, file)

    return {"message": "Username stored, proceed to create session"}


@router.get('/new_session')
async def new_session(response: Response):
    try:
        with open("login_data.json", "r") as file:
            data = json.load(file)
            username = data["username"]
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Login data not found")

    session_id = create_session(username)
    response.set_cookie(key="session_id", value=session_id)
    return {"message": "Session created", "session_id": session_id}


@router.get("/logout")
async def logout(response: Response, session_id: Annotated[str | None, Cookie()] = None):
    if not session_id:
        # If no session cookie exists, return an error indicating the user is not logged in
        raise HTTPException(status_code=404, detail="Session not found or already logged out")

    # If a session cookie exists, proceed to clear it
    response.delete_cookie("session_id")
    # Optional: Clear any server-side session data if necessary

    return {"message": "Logged out successfully"}



