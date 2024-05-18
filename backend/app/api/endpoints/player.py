from datetime import datetime, timezone

from fastapi import APIRouter
from app.db.database import connect_lp
from app.models.pricing_model import price_model  # Assuming your pricing model is in app/models

router = APIRouter()
lp_collection = connect_lp()


@router.get('/players/{gameName}')
async def player_info(gameName: str):
    projection = {
        '_id': 0, 'gameName': 1, 'leaguePoints': 1, 'date': 1,
        'delta_8h': 1, 'delta_24h': 1, 'delta_72h': 1,
    }

    try:
        # Fetch the player data without the delist_date first
        info = lp_collection.find_one({'gameName': gameName}, projection)
        if not info:
            return {"error": "player not found"}

        # Check if the delist_date exists and add it to the info if it does
        delist_date_info = lp_collection.find_one({'gameName': gameName, 'delist_date': {'$exists': True}},
                                                  {'delist_date': 1})
        delist_date = delist_date_info.get('delist_date') if delist_date_info else None

        info_date = datetime.fromisoformat(info['date'][-1])
        utc_date = info_date.astimezone(timezone.utc)

        # Apply the pricing model to each leaguePoint to calculate the price
        price_history = [price_model(lp) for lp in info['leaguePoints']]  # Convert league points to prices
        date_history = [str(date) for date in info['date']]
        date_updated = utc_date
        delta_8h = info['delta_8h']
        delta_24h = info['delta_24h']
        delta_72h = info['delta_72h']

        return {
            'name': info['gameName'],
            'price': price_history,
            'date': date_history,
            'date_updated': date_updated,
            '8 Hour Change': delta_8h,
            '24 Hour Change': delta_24h,
            '3 Day Change': delta_72h,
            'delist_date': delist_date  # This will be None if not present in the info dictionary
        }
    except Exception as e:
        return {'error': str(e)}
