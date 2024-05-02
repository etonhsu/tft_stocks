from fastapi import APIRouter, HTTPException
from pymongo import DESCENDING
from app.db.database import connect_user, connect_lp
from app.models.models import TopLeaderboard, TopLeaderboardEntry
from app.models.pricing_model import price_model

router = APIRouter()
user_collection = connect_user()
lp_collection = connect_lp()


@router.get("/top_leaderboard", response_model=TopLeaderboard)
async def get_top_leaderboard():
    try:
        # Fetch top deltas with name
        top_8h = lp_collection.find_one({}, sort=[("delta_8h", DESCENDING)])
        top_24h = lp_collection.find_one({}, sort=[("delta_24h", DESCENDING)])
        top_72h = lp_collection.find_one({}, sort=[("delta_72h", DESCENDING)])

        # Fetch top price with name
        price_data = next(lp_collection.aggregate([
            {'$addFields': {'last_lp': {'$arrayElemAt': ['$leaguePoints', -1]}}},
            {'$sort': {'last_lp': -1}},
            {'$limit': 1}
        ]), None)

        # Fetch top portfolio value with name
        portfolio_data = next(user_collection.aggregate([
            {'$addFields': {'last_portfolio': {'$arrayElemAt': ['$portfolio_history', -1]}}},
            {'$sort': {'last_portfolio': -1}},
            {'$limit': 1}
        ]), None)

        # Construct response
        response = TopLeaderboard(
            price=TopLeaderboardEntry(name=price_data['gameName'], value=price_model(price_data['last_lp'])) if price_data else None,
            delta_8h=TopLeaderboardEntry(name=top_8h['gameName'], value=top_8h['delta_8h']) if top_8h else None,
            delta_24h=TopLeaderboardEntry(name=top_24h['gameName'], value=top_24h['delta_24h']) if top_24h else None,
            delta_72h=TopLeaderboardEntry(name=top_72h['gameName'], value=top_72h['delta_72h']) if top_72h else None,
            portfolio_value=TopLeaderboardEntry(name=portfolio_data['username'], value=portfolio_data['last_portfolio']['value']) if portfolio_data else None
        )

        if not all([response.price, response.delta_8h, response.delta_24h, response.delta_72h, response.portfolio_value]):
            raise HTTPException(status_code=404, detail="Failed to retrieve all top leaderboard data")

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
