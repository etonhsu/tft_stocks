from typing import List

from fastapi import HTTPException, status, Depends

from app.core.token import get_user_from_token
from app.models.models import LeaderboardEntry, Transaction, UserPublic
from app.db.database import connect_user, connect_lp
from app.models.pricing_model import price_model

user_collection = connect_user()
lp_collection = connect_lp()


def fetch_leaderboard_entries(lead_type: str, page: int = 0, limit: int = 100) -> List[LeaderboardEntry]:
    collection = lp_collection
    skip = page * limit

    A = 1.35
    B = 0.11282

    # Determine the field and sort direction
    if 'neg_' in lead_type:
        sort_field = lead_type.replace('neg_', 'delta_')
        sort_direction = 1
    else:
        sort_field = lead_type
        sort_direction = -1

    # MongoDB aggregation pipeline
    pipeline = [
        {'$project': {
            'gameName': 1,
            'lp': {'$arrayElemAt': ['$leaguePoints', -1]},
            'delta_8h': 1,
            'delta_24h': 1,
            'delta_72h': 1
        }},
        {'$addFields': {
            'lp': {
                '$multiply': [
                    {'$pow': ['$lp', A]},
                    B
                ]
            }
        }},
        {'$sort': {sort_field: sort_direction}},
        {'$skip': skip},
        {'$limit': limit}
    ]

    try:
        lead_data = list(collection.aggregate(pipeline))
        filtered_data = [item for item in lead_data if item.get('delta_8h') is not None and item.get('delta_24h') is not None and item.get('delta_72h') is not None]

        # Recalculate ranks for the remaining entries
        entries = [
            LeaderboardEntry(
                gameName=item['gameName'],
                lp=item['lp'],
                delta_8h=item['delta_8h'],
                delta_24h=item['delta_24h'],
                delta_72h=item['delta_72h'],
                rank=index + 1 + skip  # Rank starts at 1 plus any offset from pagination
            ) for index, item in enumerate(filtered_data)
        ]
        return entries
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f'Failed to fetch leaderboard data: {str(e)}')


def fetch_recent_transactions(user: UserPublic = Depends(get_user_from_token)) -> List[Transaction]:
    user_data = user_collection.find_one({'username': user.username})

    transactions = [Transaction(**t) for t in user_data['transactions']]

    for transaction in transactions:
        transaction.price = price_model(transaction.price)

    # Reversing the list of transactions
    list_transactions = list(transactions)
    return list_transactions
