from typing import Annotated

from fastapi import APIRouter, HTTPException, Cookie

from app.core.session_backend import get_user_from_session
from app.db.database import connect_user
from app.models.models import UserPublic

user_collection = connect_user()
router = APIRouter()


@router.get('/users/{username}', response_model=UserPublic)
async def get_user(username: str):
    user_data = user_collection.find_one({'username': username})
    if not user_data:
        raise HTTPException(status_code=404, detail='User not found')

    return UserPublic(**user_data)


@router.get('/profile')
async def read_cookie(session_id: Annotated[str | None, Cookie()] = None):
    if not session_id:
        raise HTTPException(status_code=404, detail='Session ID cookie not found')
    print(session_id)
    user = get_user_from_session(session_id)
    print(user['username'])
    return user


