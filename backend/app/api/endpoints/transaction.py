from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Depends, APIRouter
from pymongo import MongoClient, ReturnDocument
from app.models.models import TransactionRequest, Player, Transaction, UserProfile, Holds
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

    if transaction_type not in ['buy', 'sell']:
        raise HTTPException(status_code=400, detail='Invalid transaction type')

    shares = transaction_data.shares
    lp_data = lp_collection.find_one({'gameName': gameName})
    if not lp_data or 'leaguePoints' not in lp_data or not lp_data['leaguePoints']:
        raise HTTPException(status_code=400, detail='Invalid gameName or leaguePoints data')

    price = price_model(lp_data['leaguePoints'][-1])
    total = shares * price
    player = Player(name=gameName, shares=shares, purchase_price=price, current_price=price)

    # Buying a player
    if transaction_type == 'buy':
        if user.balance < total:
            raise HTTPException(status_code=400, detail='Insufficient Balance')

        user.balance -= total
        if gameName in user.portfolio.players:
            old_player = user.portfolio.players[gameName]
            new_purchase_price = ((old_player.purchase_price * old_player.shares) + (price * shares)) / (
                        old_player.shares + shares)
            user.portfolio.players[gameName].purchase_price = new_purchase_price
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

        transaction_hold = Holds(
            gameName=gameName,
            shares=shares,
            hold_deadline=datetime.now(timezone.utc) + timedelta(hours=3)
        )
        user.portfolio.holds.append(transaction_hold)

    # Selling a player
    elif transaction_type == 'sell':
        if gameName not in user.portfolio.players:
            raise HTTPException(status_code=400, detail='Player not found in portfolio')

        player_in_portfolio = user.portfolio.players[gameName]
        if player_in_portfolio.shares < shares:
            raise HTTPException(status_code=400, detail='Insufficient Shares')

        total_holds = sum(hold.shares for hold in user.portfolio.holds if
                          hold.gameName == gameName and hold.hold_deadline > datetime.now())
        free_shares = player_in_portfolio.shares - total_holds
        if shares > free_shares:
            raise HTTPException(status_code=400, detail='Insufficient Free Shares')

        user.balance += total
        if player_in_portfolio.shares - shares == 0:
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

    # Ensure atomic update
    updated_user = user_collection.find_one_and_update(
        {'username': user.username},
        {'$set': {
            'balance': user.balance,
            'portfolio': user.portfolio.dict(),
            'transactions': [t.dict() for t in user.transactions]
        }},
        return_document=ReturnDocument.AFTER
    )

    if not updated_user:
        raise HTTPException(status_code=500, detail='Failed to update user data in the database.')

    return {"message": "Transaction successful"}
