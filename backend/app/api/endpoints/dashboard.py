from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.models.models import UserProfile
from app.core.token import get_user_from_token
from app.core.logic import fetch_leaderboard_entries, fetch_recent_transactions
from app.db.database import connect_lp, connect_user
from app.models.pricing_model import price_model

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')
lp_collection = connect_lp()  # Assuming this is where you connect to your 'lp' collection
user_collection = connect_user()  # Assuming this is where you connect to your 'user' collection


@router.get('/dashboard', response_model=UserProfile)
async def read_dashboard(current_user: UserProfile = Depends(get_user_from_token)):
    # Fetch user data again to get the latest state
    user_data = user_collection.find_one({'username': current_user.username})
    if not user_data:
        raise HTTPException(status_code=404, detail='User not found')

    # Update current prices in the portfolio
    portfolio = user_data.get('portfolio', {}).get('players', {})
    for player_name, player_info in portfolio.items():
        lp_data = lp_collection.find_one({'gameName': player_info['name']})
        if lp_data and 'leaguePoints' in lp_data and lp_data['leaguePoints']:
            # Assuming 'leaguePoints' is a list of prices
            current_price = lp_data['leaguePoints'][-1]
            portfolio[player_name]['current_price'] = current_price
            user_collection.update_one(
                {'username': current_user.username},
                {'$set': {f'portfolio.players.{player_name}.current_price': current_price}}
            )
        else:
            # If no current price data is found, set to None or keep the old price
            portfolio[player_name]['current_price'] = player_info.get('current_price', player_info['price'])

        # Apply pricing model
        portfolio[player_name]['current_price'] = price_model(portfolio[player_name]['current_price'])
        portfolio[player_name]['purchase_price'] = price_model(portfolio[player_name]['purchase_price'])

    updated_user_summary = UserProfile(**user_data)  # Recreate the user summary with updated data
    return updated_user_summary
