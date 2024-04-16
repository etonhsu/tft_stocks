from app.db.database import connect_lp
from time import sleep


def calculate_delta():
    lp_collection = connect_lp()
    documents = lp_collection.find()

    for doc in documents:
        # Fetch the most recent record
        current_lp = doc['leaguePoints'][-1]

        # Find the lp values at 8, 24, and 72 hours before
        lp_8h = doc['leaguePoints'][-70] if len(doc['leaguePoints']) > 70 else doc['leaguePoints'][0]
        lp_24h = doc['leaguePoints'][-210] if len(doc['leaguePoints']) > 210 else doc['leaguePoints'][0]
        lp_72h = doc['leaguePoints'][-630] if len(doc['leaguePoints']) > 630 else doc['leaguePoints'][0]

        # Calculate the delta between the lp values
        delta_8h = current_lp - lp_8h if lp_8h is not None else None
        delta_24h = current_lp - lp_24h if lp_24h is not None else None
        delta_72h = current_lp - lp_72h if lp_72h is not None else None

        # Update the database with the newest deltas
        summoner_Id = doc['summonerId']
        lp_collection.update_one(
            {'summonerId': summoner_Id},
            {'$set': {
                'delta_8h': delta_8h,
                'delta_24h': delta_24h,
                'delta_72h': delta_72h
            }}
        )


if __name__ == "__main__":
    while True:
        calculate_delta()
        sleep(3600)  # Run every hour
