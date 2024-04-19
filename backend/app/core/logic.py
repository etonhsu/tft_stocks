from typing import List

from fastapi import HTTPException, status, Depends
from pymongo import DESCENDING

from app.api.deps import get_current_user
from app.models.models import LeaderboardEntry, Transaction, UserSelf
from app.db.database import connect_user, connect_lp

user_collection = connect_user()
lp_collection = connect_lp()


def fetch_leaderboard_entries(lead_type: str, limit: int = 100) -> List[LeaderboardEntry]:
    collection = user_collection if lead_type == 'portfolio' else lp_collection

    pipeline = []
    if lead_type == 'portfolio':
        pipeline = [
            {"$unwind": "$portfolio.players"},
            {"$group": {
                "_id": "$username",
                "total_portfolio_value": {
                    "$sum": {"$multiply": ["$portfolio.players.price", "$portfolio.players.shares"]}
                }
            }},
            {"$project": {
                "username": "$_id",
                "value": "$total_portfolio_value"
            }},
            {"$sort": {"value": -1}},
            {"$limit": limit}
        ]
    elif lead_type == 'lp':
        pipeline = [
            {"$project": {
                "gameName": 1,
                "value": {"$arrayElemAt": ["$leaguePoints", -1]}
            }},
            {"$sort": {"value": -1}},
            {"$limit": limit}
        ]
    elif 'neg_' in lead_type:
        extract_key = lead_type.replace('neg_', 'delta_')
        pipeline = [
            {"$match": {extract_key: {"$exists": True}}},
            {"$project": {
                "gameName": 1,
                "value": "$" + extract_key
            }},
            {"$sort": {"value": 1}},  # Ascending for negative deltas to find the lowest values
            {"$limit": limit}
        ]
    else:
        pipeline = [
            {"$project": {
                "gameName": 1,
                "value": "$" + lead_type
            }},
            {"$sort": {"value": -1}},
            {"$limit": limit}
        ]

    try:
        lead_data = collection.aggregate(pipeline)
        entries = [
            LeaderboardEntry(
                gameName=item.get('username', item.get('gameName', 'Unknown Player')),
                value=item.get('value', 0),
                rank=index + 1
            ) for index, item in enumerate(lead_data)
        ]
        return entries
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to fetch leaderboard data: {str(e)}")


def fetch_recent_transactions(current_user: UserSelf = Depends(get_current_user)) -> List[Transaction]:
    user_data = user_collection.find_one({"username": current_user.username})

    if not user_data or 'transactions' not in user_data:
        return []  # Return an empty list if no transactions or user is found

    # Sort transactions by 'transaction_date' and limit to the most recent five entries
    recent_transactions = sorted(
        user_data['transactions'],
        key=lambda x: x['transaction_date'],
        reverse=True
    )[:5]

    # Convert to Pydantic Transaction model instances
    return [Transaction(**trans) for trans in recent_transactions]
