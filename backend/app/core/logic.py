from typing import List

from fastapi import HTTPException, status, Depends

from app.core.token import get_user_from_token
from app.models.models import LeaderboardEntry, Transaction, UserPublic
from app.db.database import connect_user, connect_lp

user_collection = connect_user()
lp_collection = connect_lp()


def fetch_leaderboard_entries(lead_type: str, page: int = 0, limit: int = 100) -> List[LeaderboardEntry]:
    collection = user_collection if lead_type == 'portfolio' else lp_collection
    skip = page * limit  # Calculate the number of documents to skip

    pipeline = []
    # Append specific stages based on the lead_type
    if lead_type == 'portfolio':
        pipeline += [
            {'$project': {
                'username': 1,
                'last_portfolio_entry': {'$arrayElemAt': ['$portfolio_history', -1]}
            }},
            {'$project': {
                'username': 1,
                'value': '$last_portfolio_entry.value'
            }},
        ]
    elif lead_type == 'lp':
        pipeline += [
            {'$project': {
                'gameName': 1,
                'value': {'$arrayElemAt': ['$leaguePoints', -1]}
            }},
        ]
    else:
        extract_key = lead_type.replace('neg_', 'delta_')
        match_and_project = {
            'gameName': 1,
            'value': '$' + extract_key
        } if 'neg_' in lead_type else {'gameName': 1, 'value': '$' + lead_type}

        pipeline += [
            {'$match': {extract_key: {'$exists': True}}} if 'neg_' in lead_type else {},
            {'$project': match_and_project},
        ]

    # Common stages to all queries
    pipeline += [
        {'$sort': {'value': -1 if not 'neg_' in lead_type else 1}},
        {'$skip': skip},
        {'$limit': limit}
    ]

    try:
        lead_data = collection.aggregate(pipeline)
        entries = [
            LeaderboardEntry(
                gameName=item.get('username', item.get('gameName', 'Unknown Player')),
                value=item.get('value', 0),
                rank=index + 1 + skip
            ) for index, item in enumerate(lead_data)
        ]
        return entries
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f'Failed to fetch leaderboard data: {str(e)}')


def fetch_recent_transactions(user: UserPublic = Depends(get_user_from_token)) -> List[Transaction]:
    user_data = user_collection.find_one({'username': user.username})

    transactions = [Transaction(**t) for t in user_data['transactions']]

    # Reversing the list of transactions
    list_transactions = list(transactions)
    return list_transactions



