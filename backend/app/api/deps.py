from datetime import datetime, timedelta
import jwt
from jwt import PyJWTError
from fastapi import status, HTTPException, Depends

from app.core.security import oauth2_scheme
from app.core.config import SECRET_KEY
from app.models.models import TokenData, UserSelf
from app.db.database import connect_user

user_collection = connect_user()


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except PyJWTError:
        raise credentials_exception
    user = user_collection.find_one({"username": token_data.username})
    if user is None:
        raise credentials_exception
    return UserSelf(**user)



