from fastapi import APIRouter, HTTPException, status
from fastapi import status
from pymongo import DESCENDING
from app.models.models import LeaderboardEntry, LeaderboardResponse
from app.db.database import connect_user, connect_lp

router = APIRouter()
user_collection = connect_user()
lp_collection = connect_lp()


@router.get('/leaderboard/{lead_type}', response_model=LeaderboardResponse)
async def get_leaderboard(lead_type: str):
    valid_types = ['portfolio', 'lp', 'delta_8h', 'delta_24h', 'delta_72h', 'neg_8h', 'neg_24h', 'neg_72h']
    if lead_type not in valid_types:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid leaderboard type")

    collection = user_collection if lead_type == 'portfolio' else lp_collection

    # Determine the appropriate field to extract based on the type of leaderboard
    if lead_type == 'portfolio':
        pipeline = [
            {"$unwind": "$portfolio.players"},
            {"$group": {
                "_id": "$username",
                "total_portfolio_value": {
                    "$sum": {"$multiply": ["$portfolio.players.price", "$portfolio.players.shares"]}}
            }},
            {"$project": {
                "username": "$_id",
                "value": "$total_portfolio_value"
            }},
            {"$sort": {"value": DESCENDING}},
            {"$limit": 100}
        ]
        lead_data = collection.aggregate(pipeline)
        extract_key = 'value'
    elif lead_type == 'lp':
        pipeline = [
            {"$project": {
                "gameName": 1,  # Assumes 'gameName' is the field name for player names
                "last_lp": {"$arrayElemAt": ["$leaguePoints", -1]}
            }},
            {"$sort": {"last_lp": DESCENDING}},
            {"$limit": 100}
        ]
        lead_data = collection.aggregate(pipeline)
        extract_key = 'last_lp'  # New field for sorting last league point
    elif 'neg_' in lead_type:
        # Determine the corresponding positive delta field for negative sorting
        if lead_type == 'neg_8h': extract_key = 'delta_8h'
        elif lead_type == 'neg_24h': extract_key = 'delta_24h'
        elif lead_type == 'neg_72h': extract_key = 'delta_72h'
        query = {extract_key: {"$exists": True}}
        lead_data = collection.find(query).sort(extract_key, 1).limit(100)  # Sorting ascending to get the lowest deltas
    else:
        lead_data = collection.find().sort(lead_type, -1).limit(100)
        extract_key = lead_type  # Use lead_type directly for other types

    try:
        entries = [
            LeaderboardEntry(
                gameName=item.get('username' if lead_type == 'portfolio' else 'gameName'),
                value=item[extract_key],
                rank=index + 1
            )
            for index, item in enumerate(lead_data)
        ]
        return LeaderboardResponse(leaderboard_type=lead_type, entries=entries)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
