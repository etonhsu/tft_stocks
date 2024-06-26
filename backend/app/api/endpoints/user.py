from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

from app.core.token import verify_token
from app.db.database import connect_user, connect_lp
from app.models.models import UserPublic, UserSelf
from app.models.pricing_model import price_model

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')  # Adjust tokenUrl if necessary
user_collection = connect_user()
lp_collection = connect_lp()
router = APIRouter()


@router.get('/users/{username}', response_model=UserPublic)
async def get_user(username: str):
    user_data = user_collection.find_one({'username': username})
    if not user_data:
        raise HTTPException(status_code=404, detail='User not found')

    portfolio = user_data.get('portfolio', {}).get('players', {})
    for player_name, player_info in portfolio.items():
        lp_data = lp_collection.find_one({'gameName': player_info['name']})
        if lp_data and 'leaguePoints' in lp_data and lp_data['leaguePoints']:
            # Assuming 'leaguePoints' is a list of prices
            current_price = price_model(lp_data['leaguePoints'][-1])
            portfolio[player_name]['current_price'] = current_price

    return UserPublic(**user_data)


@router.get('/settings')
async def read_profile(token: str = Depends(oauth2_scheme)):
    username = verify_token(token, credentials_exception=HTTPException(status_code=401, detail='Invalid token'))
    user_data = user_collection.find_one({'username': username})
    if not user_data:
        raise HTTPException(status_code=404, detail='User not found')

    return UserSelf(**user_data)


