import jwt
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import DecodeError, ExpiredSignatureError

from app.core.config import SECRET_KEY
from app.db.database import connect_user
from app.models.models import UserProfile

key = SECRET_KEY  # Use a secure, unpredictable key in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Tokens expire after 60 minutes
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
user_collection = connect_user()


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, key, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except DecodeError:
        raise credentials_exception


def get_user_from_token(token: str = Depends(oauth2_scheme)):
    username = verify_token(token, credentials_exception=HTTPException(status_code=401, detail="Invalid token"))
    user = user_collection.find_one({'username': username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserProfile(**user)
