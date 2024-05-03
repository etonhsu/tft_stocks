from fastapi import APIRouter, Depends

from app.core.token import get_user_from_token
from app.db.database import connect_user
from app.models.models import UserProfile, FavoritesEntry, FavoritesResponse

router = APIRouter()
user_collection = connect_user()


@router.get('/favorites', response_model=FavoritesResponse)
async def get_favorites(current_user: UserProfile = Depends(get_user_from_token)):
    favorites = []

    user = user_collection.find_one({'username': current_user.username})

    for entry in user.get('favorites', []):
        fav_entry = FavoritesEntry(**entry)
        favorites.append(fav_entry)

    return FavoritesResponse(favorites=favorites)


