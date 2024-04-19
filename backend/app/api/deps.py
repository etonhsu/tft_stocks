from fastapi import Depends, HTTPException, Request
from typing import Optional
from app.models.models import UserSelf
from app.db.database import connect_user

user_collection = connect_user()


def get_current_user(request: Request) -> Optional[UserSelf]:
    username = request.session.get('username')
    if not username:
        return None  # If there's no user in the session, return None
    user_data = user_collection.find_one({"username": username})
    if not user_data:
        return None  # If the user does not exist in the database, return None
    return UserSelf(**user_data)  # Convert the dictionary to a UserSelf model



