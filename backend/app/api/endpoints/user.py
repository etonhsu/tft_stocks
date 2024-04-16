from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from pymongo.errors import DuplicateKeyError

from app.db.database import connect_user  # Adjusted import for user_collection
from app.api.deps import create_access_token, get_current_user  # Adjust security utilities import
from app.core.security import pwd_context
from app.models.models import UserSelf, UserPublic

user_collection = connect_user()
router = APIRouter()


@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = user_collection.find_one({"username": form_data.username})
    if not user or not pwd_context.verify(form_data.password, user.get("password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Create a token (this is a placeholder function)
    token = create_access_token(data={"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}


@router.post('/new-user/')
async def create_user(user: UserSelf):
    user_dict = user.dict()
    username = user_dict.get('username')

    # Check if username is already in the database
    if user_collection.find_one({'username': username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken."
        )

    # Hash password if it's provided
    password = user_dict.get("password")
    if password:
        hashed_password = pwd_context.hash(password.get_secret_value())
        user_dict["password"] = hashed_password
    else:
        # Ensure password field is not included if not provided
        user_dict.pop("password", None)

    # Insert the user into the database
    try:
        result = user_collection.insert_one(user_dict)
        return {"username": username, "id": str(result.inserted_id)}
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user."
        )


@router.get('/users/{username}', response_model=UserPublic)
async def get_user(username: str):
    user_data = user_collection.find_one({'username': username})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return UserPublic(**user_data)


@router.get("/users/me", response_model=UserPublic)
async def read_users_me(current_user: UserSelf = Depends(get_current_user)):
    return current_user
