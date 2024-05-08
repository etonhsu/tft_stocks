from datetime import datetime
from typing import Annotated

from fastapi import HTTPException, Depends, APIRouter, Cookie

from app.models.models import TransactionRequest, Player, Transaction, UserProfile
from app.db.database import connect_lp, connect_user
from app.core.token import get_user_from_token
from app.models.pricing_model import price_model

router = APIRouter()
lp_collection = connect_lp()
user_collection = connect_user()


@router.post('/players/{gameName}/{transaction_type}')
async def add_transaction(
        gameName: str,
        transaction_type: str,
        transaction_data: TransactionRequest,
        user: UserProfile = Depends(get_user_from_token)
):

    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    # Verify the transaction type is valid
    if transaction_type not in ['buy', 'sell']:
        raise HTTPException(status_code=400, detail='Invalid transaction type')

    # Set transaction details
    shares = transaction_data.shares
    price = price_model(lp_collection.find_one({'gameName': gameName})['leaguePoints'][-1])
    total = shares * price
    player = Player(name=gameName, shares=shares, purchase_price=price, current_price=price)

    # Buying a player
    if transaction_type == 'buy':
        if user.balance < total:  # Check sufficient balance for transaction
            raise HTTPException(status_code=400, detail='Insufficient Balance')

        user.balance -= total
        if gameName in user.portfolio.players:
            user.portfolio.players[gameName].shares += shares
        else:
            user.portfolio.players[gameName] = player
        transaction = Transaction(
            type=transaction_type,
            gameName=gameName,
            shares=shares,
            price=price,
            transaction_date=datetime.now()
        )
        user.transactions.append(transaction)

    # Selling a player
    if transaction_type == 'sell':
        if gameName not in user.portfolio.players:
            raise HTTPException(status_code=400, detail='player not found in portfolio')

        if user.portfolio.players[gameName].shares < shares:
            raise HTTPException(status_code=400, detail='Insufficient Shares')

        user.balance += total
        if user.portfolio.players[gameName].shares - shares == 0:
            del user.portfolio.players[gameName]
        else:
            user.portfolio.players[gameName].shares -= shares
        transaction = Transaction(
            type=transaction_type,
            gameName=gameName,
            shares=shares,
            price=price,
            transaction_date=datetime.now()
        )
        user.transactions.append(transaction)

    # Update the results to the user database
    update_db = user_collection.update_one(
        {'username': user.username},
        {'$set': {
            'balance': user.balance,
            'portfolio': user.portfolio.dict(),
            'transactions': [t.dict() for t in user.transactions]
        }}
    )

    if update_db.modified_count == 0:
        raise HTTPException(status_code=500, detail='Failed to update user data in the database.')

