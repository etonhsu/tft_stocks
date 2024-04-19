from fastapi import APIRouter, HTTPException, status

from app.models.models import LeaderboardResponse
from app.core.logic import fetch_leaderboard_entries

router = APIRouter()


@router.get('/leaderboard/{lead_type}', response_model=LeaderboardResponse)
async def get_leaderboard(lead_type: str):
    valid_types = ['portfolio', 'lp', 'delta_8h', 'delta_24h', 'delta_72h', 'neg_8h', 'neg_24h', 'neg_72h']
    if lead_type not in valid_types:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid leaderboard type')

    entries = fetch_leaderboard_entries(lead_type)
    return LeaderboardResponse(leaderboard_type=lead_type, entries=entries)