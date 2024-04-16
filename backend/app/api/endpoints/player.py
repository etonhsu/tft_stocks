from typing import List

from fastapi import APIRouter
from app.models.models import BasePlayer
from app.db.database import connect_lp

router = APIRouter()
lp_collection = connect_lp()


@router.get('/players', response_model=List[BasePlayer])
async def get_players():
    # Retrieve list players and their LP from database
    projection = {'_id': 0, 'gameName': 1, 'leaguePoints': 1}
    try:
        info = lp_collection.find({}, projection)
        players_list = [BasePlayer(name=item['gameName'], price=item['leaguePoints'][-1]) for item in info]
        return players_list
    except Exception as e:
        return {"error": str(e)}


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
        return {"error": str(e)}