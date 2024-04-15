from datetime import datetime
from fastapi import FastAPI, HTTPException, status, Depends
from passlib.context import CryptContext
from pymongo import DESCENDING
from pymongo.errors import DuplicateKeyError
from models import (
    BasePlayer, Player, UserSelf,
    UserPublic, Transaction, TransactionRequest,
    LeaderboardEntry, LeaderboardResponse
)
from typing import List
from database import connect_lp, connect_player_Id, connect_user

app = FastAPI()
lp_collection = connect_lp()
Id_collection = connect_player_Id()
user_collection = connect_user()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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


async def get_user():
    user_data = user_collection.find_one({'username': 'new_user'})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return UserSelf(**user_data)


@app.post('/players/{gameName}/{transaction_type}')
async def add_transaction(
        gameName: str,
        transaction_type: str,
        transaction_data: TransactionRequest,
        user: UserSelf = Depends(get_user)
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
            shares=shares,
            price=price,
            transaction_date=datetime.now()
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
        hashed_password = pwd_context.hash(password.get_secret_value())
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


@app.get('/leaderboard/{lead_type}', response_model=LeaderboardResponse)
async def get_leaderboard(lead_type: str):
    valid_types = ['portfolio', 'lp', 'delta_8h', 'delta_24h', 'delta_72h', 'neg_8h', 'neg_24h', 'neg_72h']
    if lead_type not in valid_types:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid leaderboard type")

    collection = user_collection if lead_type == 'portfolio' else lp_collection

    # Determine the appropriate field to extract based on the type of leaderboard
    if lead_type == 'lp':
        pipeline = [
            {"$project": {
                "gameName": 1,  # Assumes 'gameName' is the field name for player names
                "last_lp": {"$arrayElemAt": ["$leaguePoints", -1]}
            }},
            {"$sort": {"last_lp": DESCENDING}},
            {"$limit": 100}
        ]
        lead_data = collection.aggregate(pipeline)
        extract_key = 'last_lp'  # New field for sorting last league point
    elif 'neg_' in lead_type:
        # Determine the corresponding positive delta field for negative sorting
        if lead_type == 'neg_8h': extract_key = 'delta_8h'
        elif lead_type == 'neg_24h': extract_key = 'delta_24h'
        elif lead_type == 'neg_72h': extract_key = 'delta_72h'
        query = {extract_key: {"$exists": True}}
        lead_data = collection.find(query).sort(extract_key, 1).limit(100)  # Sorting ascending to get the lowest deltas
    else:
        lead_data = collection.find().sort(lead_type, -1).limit(100)
        extract_key = lead_type  # Use lead_type directly for other types

    try:
        entries = [
            LeaderboardEntry(
                gameName=item.get('username' if lead_type == 'portfolio' else 'gameName'),
                value=item[extract_key],
                rank=index + 1
            )
            for index, item in enumerate(lead_data)
        ]
        return LeaderboardResponse(leaderboard_type=lead_type, entries=entries)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
