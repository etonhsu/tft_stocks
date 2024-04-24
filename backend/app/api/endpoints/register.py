from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.core.token import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.db.database import connect_user
from passlib.context import CryptContext

router = APIRouter()
user_collection = connect_user()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post('/register')
async def register(form_data: OAuth2PasswordRequestForm = Depends()):
    user = user_collection.find_one({"username": form_data.username})
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")

    # Hash the password before storing it
    hashed_password = pwd_context.hash(form_data.password)
    new_user = {
        "username": form_data.username,
        "password": hashed_password  # Store the hashed password
    }
    user_collection.insert_one(new_user)

    # Create token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": form_data.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
