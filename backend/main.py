from datetime import datetime

from fastapi import FastAPI, HTTPException, status
from pymongo.errors import DuplicateKeyError
from models import BasePlayer, Player, UserSelf, UserPublic, Transaction, TransactionRequest
from typing import List
from database import connect_lp, connect_player_Id, connect_user
from config import PWD_CONTEXT

app = FastAPI()
lp_collection = connect_lp()
Id_collection = connect_player_Id()
user_collection = connect_user()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get('/players', response_model=List[BasePlayer])
async def get_players():
    # Retrieve list players and their LP from database
    projection = {'_id': 0, 'gameName': 1, 'leaguePoints': 1}
    try:
        info = lp_collection.find({}, projection)
        players_list = [BasePlayer(name=item['gameName'], price=item['leaguePoints'][-1]) for item in info]
        return players_list
    except Exception as e:
        return {"error": str(e)}


@app.get('/players/{gameName}')
async def player_info(gameName: str):
    projection = {'_id': 0, 'gameName': 1, 'leaguePoints': 1, 'date': 1}
    try:
        info = lp_collection.find_one({'gameName': gameName}, projection)
        price_history = [price for price in info['leaguePoints']]
        date_history = [str(date) for date in info['date']]
        return {
            'name': info['gameName'],
            'price': price_history,
            'date': date_history
        }
    except Exception as e:
        return {"error": str(e)}


@app.post('/players/{gameName}/{transaction_type}')
async def add_transaction(
        gameName: str,
        transaction_type: str,
        transaction_data: TransactionRequest,
        user=UserSelf,
):
    # Verify the transaction type is valid
    if transaction_type not in ["buy", "sell"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    # Set transaction details
    shares = transaction_data.shares
    price = lp_collection.find_one({'gameName': gameName})['leaguePoints'][-1]
    total = shares * price
    player = Player(name=gameName, shares=shares, price=price)

    # Buying a player
    if transaction_type == 'buy':
        if user.balance < total:  # Check sufficient balance for transaction
            raise HTTPException(status_code=400, detail="Insufficient Balance")

        user.balance -= total
        if gameName in user.portfolio.players:
            user.portfolio.players[gameName].shares += shares
        else:
            user.portfolio.players[gameName] = player
        transaction = Transaction(
            type=transaction_type,
            gameName=gameName,
            quantity=shares,
            price=price,
            transaction_date = datetime.now()
        )
        user.transactions.append(transaction)

    # Selling a player
    if transaction_type == 'sell':
        if gameName not in user.portfolio.players:
            raise HTTPException(status_code=400, detail="Player not found in portfolio")

        if user.portfolio.players[gameName].shares < shares:
            raise HTTPException(status_code=400, detail="Insufficient Shares")

        user.balance += total
        if user.portfolio.players[gameName].shares - shares == 0:
            del user.portfolio.players[gameName]
        else:
            user.portfolio.players[gameName].shares -= shares
        transaction = Transaction(
            type=transaction_type,
            gameName=gameName,
            quantity=shares,
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
        raise HTTPException(status_code=500, detail="Failed to update user data in the database.")


@app.post('/new-user/')
async def create_user(user: UserSelf):
    user_dict = user.dict()
    username = user_dict.get('username')

    # Check if username is already in the database
    if user_collection.find_one({'username': username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken."
        )

    # Hash password if it's provided
    password = user_dict.get("password")
    if password:
        hashed_password = PWD_CONTEXT.hash(password.get_secret_value())
        user_dict["password"] = hashed_password
    else:
        # Ensure password field is not included if not provided
        user_dict.pop("password", None)

    # Insert the user into the database
    try:
        result = user_collection.insert_one(user_dict)
        return {"username": username, "id": str(result.inserted_id)}
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user."
        )


@app.get('/users/{username}', response_model=UserPublic)
async def get_user(username: str):
    user_data = user_collection.find_one({'username': username})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return UserPublic(**user_data)
