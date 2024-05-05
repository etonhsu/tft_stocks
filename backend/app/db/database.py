from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import os
import logging

load_dotenv()

logging.basicConfig(level=logging.DEBUG)
MONGO_URI = os.getenv("MONGO_URI")
logging.debug(f"MONGO_URI: {MONGO_URI}")

client = MongoClient(MONGO_URI, server_api=ServerApi('1'))


def connect_lp():
    db = client['TFT_Stocks']
    collection = db['player_lp']
    return collection


def connect_player_Id():
    db = client['TFT_Stocks']
    collection = db['player_Id']
    return collection


def connect_user():
    db = client['TFT_Stocks']
    collection = db['users']
    return collection
