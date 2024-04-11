from fastapi import FastAPI
from models import PlayerListing, Portfolio
from typing import List
from database import connect_lp, connect_player_Id

app = FastAPI()
lp_collection = connect_lp()
Id_collection = connect_player_Id()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get('/players', response_model=List[PlayerListing])
async def get_players():
    # Retrieve list players and their LP from database
    projection = {'_id': 0, 'summonerName': 1, 'leaguePoints': 1}
    try:
        info = lp_collection.find({}, projection)
        players_list = [PlayerListing(name=item['summonerName'], price=item['leaguePoints'][-1]) for item in info]
        return players_list
    except Exception as e:
        return {"error": str(e)}


@app.get('/players/{summonerName}')
async def player_info(summonerName: str):
    projection = {'_id': 0, 'summonerName': 1, 'leaguePoints': 1, 'date': 1}
    try:
        info = lp_collection.find_one({'summonerName': summonerName}, projection)
        price_history = [price for price in info['leaguePoints']]
        date_history = [str(date) for date in info['date']]
        return {
            'name': info['summonerName'],
            'price': price_history,
            'date': date_history
        }
    except Exception as e:
        return {"error": str(e)}
