from datetime import timedelta

from fastapi import APIRouter, Form, HTTPException, status

from app.core.token import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.db.database import connect_user

router = APIRouter()
user_collection = connect_user()


@router.post('/login')
async def login(username: str = Form(...)):
    user = user_collection.find_one({'username': username})
    if not user:
        # Instead of redirecting, it sends a clear message to register first.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Username not found. Please register.')

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={'sub': username}, expires_delta=access_token_expires)
    return {'access_token': access_token, 'token_type': 'bearer'}




