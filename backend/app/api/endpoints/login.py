from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.core.token import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.db.database import connect_user
from passlib.context import CryptContext

router = APIRouter()
user_collection = connect_user()
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


@router.post('/login')
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    username_lower = form_data.username.lower()
    user = user_collection.find_one({'username_lower': username_lower})

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Username not found. Please register.')

    # Verify password
    if not pwd_context.verify(form_data.password, user['password']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect password')

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={'sub': user['username']}, expires_delta=access_token_expires)
    return {'access_token': access_token, 'token_type': 'bearer'}
