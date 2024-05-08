from fastapi import APIRouter, HTTPException, status, Query, Depends

from app.models.models import LeaderboardResponse, PortfolioLeaderboardResponse
from app.core.logic import fetch_leaderboard_entries, fetch_portfolio_leaderboard

router = APIRouter()


def response_model_selector(lead_type: str):
    if lead_type == "portfolio":
        return PortfolioLeaderboardResponse
    elif lead_type in ["lp", "delta_8h", "delta_24h", "delta_72h", "neg_8h", "neg_24h", "neg_72h"]:
        return LeaderboardResponse
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid leaderboard type")


@router.get('/leaderboard/{lead_type}')  # We avoid specifying response_model directly here
async def get_leaderboard(
    lead_type: str,
    response_model=Depends(response_model_selector),  # Inject the dynamically determined model
    limit: int = Query(default=100, ge=1),
    page: int = Query(default=0, ge=0)
):
    if lead_type == "portfolio":
        entries = fetch_portfolio_leaderboard(limit=limit)
    else:
        entries = fetch_leaderboard_entries(lead_type, page=page, limit=limit)

    return response_model(leaderboard_type=lead_type, entries=entries)

