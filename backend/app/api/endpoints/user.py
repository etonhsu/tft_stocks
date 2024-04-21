from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

from app.core.token import verify_token
from app.db.database import connect_user
from app.models.models import UserPublic, UserSelf

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # Adjust tokenUrl if necessary
user_collection = connect_user()
router = APIRouter()


@router.get('/users/{username}', response_model=UserPublic)
async def get_user(username: str):
    user_data = user_collection.find_one({'username': username})
    if not user_data:
        raise HTTPException(status_code=404, detail='User not found')

    return UserPublic(**user_data)


@router.get('/profile')
async def read_profile(token: str = Depends(oauth2_scheme)):
    username = verify_token(token, credentials_exception=HTTPException(status_code=401, detail="Invalid token"))
    user_data = user_collection.find_one({'username': username})
    if not user_data:
        raise HTTPException(status_code=404, detail='User not found')

    # Assuming UserPublic is a Pydantic model that defines how user data should be returned
    return UserSelf(**user_data)


