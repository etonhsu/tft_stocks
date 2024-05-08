import jwt
from datetime import datetime, timedelta, timezone
import logging

from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import DecodeError, ExpiredSignatureError

from app.db.database import connect_user
from app.models.models import UserProfile
from app.utils.get_secret import get_secret

key = get_secret('secret_key')  # Use a secure, unpredictable key in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
user_collection = connect_user()


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta if expires_delta else timedelta(minutes=180))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key, algorithm=ALGORITHM)
    logging.debug(f"Token created with expiry {expire} and data {to_encode}")
    return encoded_jwt


def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, key, algorithms=[ALGORITHM])
        logging.debug(f"Decoded payload: {payload}")
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except ExpiredSignatureError as e:
        logging.error("Token expired: " + str(e))
        raise HTTPException(status_code=401, detail="Token expired")
    except DecodeError as e:
        logging.error("Token decode error: " + str(e))
        raise credentials_exception


def get_user_from_token(token: str = Depends(oauth2_scheme)):
    try:
        # Assuming 'verify_token' extracts the username from the token
        username = verify_token(token, credentials_exception=HTTPException(status_code=401, detail="Invalid token"))
        # Fetch user data based on username
        user = user_collection.find_one({'username': username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserProfile(**user)
    except (DecodeError, ExpiredSignatureError) as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        # Generic exception catch to handle unexpected errors
        raise HTTPException(status_code=500, detail="An error occurred")
