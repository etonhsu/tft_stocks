import json
from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.models.models import UserProfile
from app.core.token import get_user_from_token
from app.db.database import connect_lp, connect_user
from app.tasks.portfolio_change import portfolio_change
from app.tasks.dashboard_refresh import dashboard_refresh
from app.utils.redis_utils import get_cache, set_cache

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')
lp_collection = connect_lp()  # Assuming this is where you connect to your 'lp' collection
user_collection = connect_user()  # Assuming this is where you connect to your 'user' collection


class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)  # Convert ObjectId to string
        if isinstance(obj, datetime):
            return obj.isoformat()  # Convert datetime objects to ISO format
        return json.JSONEncoder.default(self, obj)


@router.get('/dashboard', response_model=UserProfile)
async def read_dashboard(current_user: UserProfile = Depends(get_user_from_token)):

    try:
        refreshed_user_data = dashboard_refresh(current_user)
        updated_user_data = portfolio_change(refreshed_user_data)
    except Exception as e:
        print(f"Error processing dashboard data: {e}")
        raise HTTPException(status_code=500, detail="Error processing dashboard data")


    return UserProfile(**updated_user_data)

