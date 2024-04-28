from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Dict, Optional

from app.models.models import Player, UserPublic, UserSelf  # Assuming Player model is defined
from app.core.token import get_user_from_token
from app.db.database import connect_lp, connect_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')
lp_collection = connect_lp()
user_collection = connect_user()


class PortfolioData(BaseModel):
    players: Dict[str, Player]


@router.get('/portfolio', response_model=PortfolioData)
async def read_portfolio(current_user: UserSelf = Depends(get_user_from_token)):
    user_data = user_collection.find_one({'username': current_user.username})
    if not user_data or 'portfolio' not in user_data:
        raise HTTPException(status_code=404, detail='Portfolio not found')

    portfolio = user_data.get('portfolio', {}).get('players', {})
    for player_name, player_info in portfolio.items():
        lp_data = lp_collection.find_one({'gameName': player_info['name']})
        if lp_data and 'leaguePoints' in lp_data and lp_data['leaguePoints']:
            current_price = lp_data['leaguePoints'][-1]  # Assuming 'leaguePoints' is a list of prices
            portfolio[player_name]['current_price'] = current_price
        else:
            portfolio[player_name]['current_price'] = player_info.get('current_price', player_info['price'])

    return PortfolioData(players=portfolio)
