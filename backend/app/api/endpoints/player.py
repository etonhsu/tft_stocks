from typing import List

from fastapi import APIRouter
from app.models.models import BasePlayer
from app.db.database import connect_lp

router = APIRouter()
lp_collection = connect_lp()


@router.get('/players/{gameName}')
async def player_info(gameName: str):
    projection = {'_id': 0, 'gameName': 1, 'leaguePoints': 1, 'date': 1}
    try:
        info = lp_collection.find_one({'gameName': gameName}, projection)
        price_history = [price for price in info['leaguePoints']]
        date_history = [str(date) for date in info['date']]
        return {
            'name': info['gameName'],
            'price': price_history,
            'date': date_history
        }
    except Exception as e:
        return {'error': str(e)}