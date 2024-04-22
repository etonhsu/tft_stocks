from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer

from app.models.models import DashboardData, UserPublic
from app.core.token import get_user_from_token
from app.core.logic import fetch_leaderboard_entries, fetch_recent_transactions

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # Adjust tokenUrl if necessary


@router.get("/dashboard", response_model=DashboardData)
async def read_dashboard(current_user: UserPublic = Depends(get_user_from_token)):
    transactions = current_user.transactions
    leaderboard = fetch_leaderboard_entries('lp', 5)

    return DashboardData(
        user_summary=current_user,
        top_leaderboard_entries=leaderboard,
        recent_transactions=transactions
    )
