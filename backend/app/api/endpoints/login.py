from datetime import timedelta

from fastapi import APIRouter, Form

from app.core.token import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()


@router.post('/login')
async def login(username: str = Form(...)):
    # You might want to add user validation here to check if the user exists and is valid
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}




