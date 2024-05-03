from bson import ObjectId
from fastapi import APIRouter, Depends

from app.core.token import get_user_from_token
from app.db.database import connect_user, connect_lp
from app.models.models import FavoritesEntry, UserProfile, ToggleFavoriteRequest
from app.models.pricing_model import price_model

router = APIRouter()
user_collection = connect_user()
lp_collection = connect_lp()


@router.post('/toggle_favorites', response_model=bool)
async def toggle_favorites(request: ToggleFavoriteRequest, current_user: UserProfile = Depends(get_user_from_token)):
    gameName = request.gameName
    player = lp_collection.find_one({"gameName": gameName})
    user = user_collection.find_one({"username": current_user.username})

    # Ensure favorites are properly handled
    favorites = user.get('favorites', [])
    favorites_dict = {fav['name']: fav for fav in favorites}
    is_favorite = gameName in favorites_dict

    if is_favorite:
        user_collection.update_one(
            {'_id': user['_id']},
            {'$pull': {'favorites': {'name': gameName}}}
        )
        return False
    else:
        favorite = FavoritesEntry(
            name=gameName,
            current_price=price_model(player['leaguePoints'][-1]),
            eight_hour_change=player['delta_8h'],
            one_day_change=player['delta_24h'],
            three_day_change=player['delta_72h']
        ).dict()
        user_collection.update_one(
            {'_id': user['_id']},
            {'$push': {'favorites': favorite}}
        )
        return True


@router.get('/favorite_status/{gameName}', response_model=bool)
async def get_favorite_status(gameName: str, current_user: UserProfile = Depends(get_user_from_token)):
    user = user_collection.find_one({"username": current_user.username})
    is_favorited = any(fav['name'] == gameName for fav in user.get('favorites', []))
    return is_favorited




