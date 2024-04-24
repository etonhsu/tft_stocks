from fastapi import APIRouter, HTTPException, status
from app.db.database import connect_user, connect_lp

router = APIRouter()
user_collection = connect_user()
lp_collection = connect_lp()


@router.get("/search/players/{query}")
async def search_players(query: str):
    query_lower = query.lower()
    lp_data = lp_collection.find_one({"gameName_lower": query_lower})
    if not lp_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Player not found')
    return {"gameName": lp_data['gameName']}


@router.get("/search/users/{query}")
async def search_users(query: str):
    query_lower = query.lower()
    user_data = user_collection.find_one({"username_lower": query_lower})
    if not user_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return {"username": user_data['username']}
