from fastapi import APIRouter, Depends

from app.api.endpoints.dashboard import CustomEncoder
from app.models.models import UserProfile
from app.core.token import get_user_from_token
from app.tasks.dashboard_refresh import dashboard_refresh
from app.utils.redis_utils import set_cache, clear_cache  # Assuming clear_cache is implemented
from app.db.database import connect_user, connect_lp

import json

router = APIRouter()
user_collection = connect_user()
lp_collection = connect_lp()


@router.post('/refresh_dashboard')
async def refresh_dashboard(current_user: UserProfile = Depends(get_user_from_token)):
    cache_key = f"{current_user.username}_dashboard"

    # Clear the cache
    clear_cache(cache_key)

    # Fetch fresh data and handle it similarly as in your GET endpoint
    user_data = dashboard_refresh(current_user)

    # Serialize and recache the data
    serialized_data = json.dumps(user_data, cls=CustomEncoder)
    set_cache(cache_key, serialized_data, expiration=600)  # Recache the fresh data

    return UserProfile(**json.loads(serialized_data))



