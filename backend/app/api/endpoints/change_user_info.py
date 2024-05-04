from fastapi import APIRouter, HTTPException, Depends, status, Body
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pymongo.collection import Collection

from app.core.token import get_user_from_token
from app.db.database import connect_user
from app.models.models import UserSelf, PasswordUpdateModel, UsernameChangeRequest

router = APIRouter()
user_collection = connect_user()  # Assume this returns a MongoDB collection
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 setup (assuming you have token-based authentication in place)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.post("/change_username")
async def change_username(request: UsernameChangeRequest, user_data: UserSelf = Depends(get_user_from_token)):
    username_lower = request.newUsername.lower()
    # Find if new username already exists
    if user_collection.find_one({"username_lower": username_lower}):
        raise HTTPException(status_code=400, detail="Username already taken")

    # Update username
    result = user_collection.update_one(
        {"username": user_data.username},
        {"$set": {"username": request.newUsername, "username_lower": username_lower}}
    )
    if result.modified_count == 1:
        return {"message": "Username updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Username update failed")


@router.post("/change_password")
async def change_password(passwords: PasswordUpdateModel = Body(...), user_data: UserSelf = Depends(get_user_from_token)):
    user = user_collection.find_one({"username": user_data.username})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Verify old password
    if not pwd_context.verify(passwords.oldPassword, user['password']):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Old password is incorrect")

    # Hash new password
    hashed_password = pwd_context.hash(passwords.newPassword)

    # Update password in database
    result = user_collection.update_one(
        {"username": user_data.username},
        {"$set": {"password": hashed_password}}
    )
    if result.modified_count == 1:
        return {"message": "Password updated successfully"}
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Password update failed")
