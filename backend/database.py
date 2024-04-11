from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from config import MONGO_URI


def connect_lp():
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
    db = client['test']
    collection = db['test_lp']
    return collection


def connect_player_Id():
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
    db = client['TFT_Stocks']
    collection = db['player_Id']
    return collection


def connect_user():
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
    db = client['TFT_Stocks']
    collection = db['users']
    return collection
