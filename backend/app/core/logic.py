from datetime import timezone, datetime
from typing import List

from fastapi import HTTPException, status, Depends

from app.core.token import get_user_from_token
from app.models.models import LeaderboardEntry, Transaction, UserPublic, PortfolioLeaderboardEntry
from app.db.database import connect_user, connect_lp
from app.models.pricing_model import price_model

user_collection = connect_user()
lp_collection = connect_lp()


def fetch_leaderboard_entries(lead_type: str, page: int = 0, limit: int = 100) -> List[LeaderboardEntry]:
    collection = lp_collection  # Assume lp_collection is properly connected
    skip = page * limit

    A = 1.35
    B = 0.11282

    # Determine the field and sort direction based on 'neg_' prefix
    if 'neg_' in lead_type:
        sort_field = lead_type.replace('neg_', 'delta_')  # Remove 'neg_' prefix for correct field name
        sort_direction = 1  # Sort ascending for 'neg_' versions
    else:
        sort_field = lead_type
        sort_direction = -1  # Sort descending for normal cases

    # MongoDB aggregation pipeline
    pipeline = [
        {'$project': {
            'gameName': 1,
            'lp': {'$arrayElemAt': ['$leaguePoints', -1]},  # Get the last element of leaguePoints
            'delta_8h': 1,
            'delta_24h': 1,
            'delta_72h': 1
        }},
        {'$match': {'lp': {'$gt': 0}}},  # Ensure that only entries with lp greater than 0 are processed
        {'$addFields': {
            'lp': {
                '$multiply': [
                    {'$pow': ['$lp', A]},  # Raise lp to the power of A
                    B  # Multiply the result by B
                ]
            }
        }},
        {'$sort': {sort_field: sort_direction}},  # Sort by the specified field and direction
        {'$skip': skip},  # Skip a number of documents
        {'$limit': limit}  # Limit the results to 'limit'
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


def fetch_portfolio_leaderboard(page: int = 0, limit: int = 100) -> List[PortfolioLeaderboardEntry]:
    collection = user_collection  # Assume user_collection is properly connected
    skip = page * limit

    # MongoDB aggregation pipeline
    pipeline = [
        {'$project': {
            'username': 1,
            'value': {'$arrayElemAt': ['$portfolio_history.value', -1]}  # Get the last value element from portfolio_history
        }},
        {'$sort': {'value': -1}},
        {'$skip': skip},  # Skip a number of documents
        {'$limit': limit}  # Limit the results to 'limit'
    ]

    try:
        lead_data = list(collection.aggregate(pipeline))
        filtered_data = [item for item in lead_data if item.get('value') is not None]

        # Recalculate ranks for the remaining entries
        entries = [
            PortfolioLeaderboardEntry(
                username=item['username'],
                value=item['value'],
                rank=index + 1 + skip
            ) for index, item in enumerate(filtered_data)
        ]
        return entries
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f'Failed to fetch portfolio leaderboard data: {str(e)}')


def fetch_recent_transactions(user: UserPublic = Depends(get_user_from_token)) -> List[Transaction]:
    user_data = user_collection.find_one({'username': user.username})

    transactions = []
    for t in user_data['transactions']:
        # Ensure the transaction date is converted to a datetime object with UTC
        t['transaction_date'] = datetime.fromisoformat(t['transaction_date']).replace(tzinfo=timezone.utc)
        transaction = Transaction(**t)
        transaction.price = price_model(transaction.price)
        transactions.append(transaction)

    # Reversing the list of transactions
    list_transactions = list(transactions)
    return list_transactions
