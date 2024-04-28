from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.models.models import UserPublic, Transaction
from app.core.token import get_user_from_token
from app.core.logic import fetch_recent_transactions
from app.db.database import connect_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')
user_collection = connect_user()  # Assuming this is where you connect to your 'user' collection


@router.get('/transaction_history', response_model=list[Transaction])
async def transaction_history(current_user: UserPublic = Depends(get_user_from_token)):
    user_data = user_collection.find_one({'username': current_user.username})
    if not user_data:
        raise HTTPException(status_code=404, detail='User not found')

    transactions = fetch_recent_transactions(current_user)

    return transactions

