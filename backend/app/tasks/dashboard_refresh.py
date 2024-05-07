from fastapi import HTTPException

from app.db.database import connect_user, connect_lp
from app.models.models import UserProfile
from app.models.pricing_model import price_model

user_collection = connect_user()
lp_collection = connect_lp()


def dashboard_refresh(user: UserProfile):
    user_data = user_collection.find_one({'username': '2 Brain Cell'})
    # if not user_data:
    #     raise HTTPException(status_code=404, detail='User not found')
    #
    # # Update current prices in the portfolio
    # portfolio = user_data.get('portfolio', {}).get('players', {})
    # for player_name, player_info in portfolio.items():
    #     lp_data = lp_collection.find_one({'gameName': player_info['name']})
    #     if lp_data and 'leaguePoints' in lp_data and lp_data['leaguePoints']:
    #         # Assuming 'leaguePoints' is a list of prices
    #         current_price = lp_data['leaguePoints'][-1]
    #         portfolio[player_name]['current_price'] = current_price
    #         user_collection.update_one(
    #             {'username': user.username},
    #             {'$set': {f'portfolio.players.{player_name}.current_price': current_price}}
    #         )
    #     else:
    #         # If no current price data is found, set to None or keep the old price
    #         portfolio[player_name]['current_price'] = player_info.get('current_price', player_info['price'])
    #
    #     # Apply pricing model
    #     portfolio[player_name]['current_price'] = price_model(portfolio[player_name]['current_price'])
    #     portfolio[player_name]['purchase_price'] = price_model(portfolio[player_name]['purchase_price'])

    return user_data
