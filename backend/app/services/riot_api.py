from time import sleep
from datetime import datetime
import json

import requests

from backend.app.core.config import RIOT_API_KEY
from backend.app.db.database import connect_lp, connect_player_Id
from backend.app.utils.converter import convert


# Two databases use
point_collection = connect_lp()
Id_collection = connect_player_Id()

# All the Riot API calls
chall_url = 'https://na1.api.riotgames.com/tft/league/v1/challenger?queue=RANKED_TFT&api_key=' + RIOT_API_KEY
gm_url = 'https://na1.api.riotgames.com/tft/league/v1/grandmaster?queue=RANKED_TFT&api_key=' + RIOT_API_KEY
master_url = 'https://na1.api.riotgames.com/tft/league/v1/master?queue=RANKED_TFT&api_key=' + RIOT_API_KEY

while True:
    chall_resp = requests.get(chall_url)
    gm_resp = requests.get(gm_url)
    master_resp = requests.get(master_url)

    chall_info = chall_resp.json()
    gm_info = gm_resp.json()
    master_info = master_resp.json()

    # Parsing through Riot API request for relevant data
    chall_data = [{'summonerId': d['summonerId'], 'leaguePoints': d['leaguePoints']} for d in chall_info['entries']]
    gm_data = [{'summonerId': d['summonerId'], 'leaguePoints': d['leaguePoints']} for d in gm_info['entries']]
    master_data = [{'summonerId': d['summonerId'], 'leaguePoints': d['leaguePoints']} for d in master_info['entries']]
    combined_data = chall_data + gm_data + master_data

    summonerIds = [data['summonerId'] for data in combined_data]
    entries = Id_collection.find({'summonerId': {'$in': summonerIds}})
    entries_dict = {entry['summonerId']: entry for entry in entries}

    # Using saved summonerId to gameName conversion and writing gameName and leaguePoints to DB
    need_conversion = []
    cur = str(datetime.now())
    for data in combined_data:
        leaguePoints = data['leaguePoints']
        entry = entries_dict.get(data['summonerId'])
        update_entry = {}

        # Updates the LP database
        if entry:
            gameName = entry.get('gameName')
            if gameName:
                query = {'summonerId': data['summonerId']}
                update_operation = {
                    '$push': {
                        'leaguePoints': leaguePoints,
                        'date': cur
                    },
                    '$set': {
                        'gameName': gameName,
                        'summonerId': data['summonerId'],
                    }
                }
                point_collection.update_one(query, update_operation, upsert=True)
            else:
                print(f"No gameName found for summonerId: {data['summonerId']}")
        else:
            print(f"No entry found for summonerId: {data['summonerId']}")
            need_conversion.append(data['summonerId'])

    # Converting new additions to Masters+ from summonerId to gameName, and adding to conversion DB
    if need_conversion:
        converted = convert(need_conversion)
        with open('converted.json', 'w') as json_file:
            json.dump(converted, json_file, indent=4)

        with open('converted.json', 'r') as json_file:
            converted_data = json.load(json_file)

        Id_collection.insert_many(converted_data)
    sleep(300)
