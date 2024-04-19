from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from app.core.config import MONGO_URI

client = MongoClient(MONGO_URI, server_api=ServerApi('1'))


def connect_lp():
    db = client['test']
    collection = db['test_lp']
    return collection


def connect_player_Id():
    db = client['TFT_Stocks']
    collection = db['player_Id']
    return collection


def connect_user():
    db = client['TFT_Stocks']
    collection = db['users']
    return collection
