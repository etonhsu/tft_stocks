from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

def connect_mongo():
    uri = "mongodb+srv://etonhsu:mwd7pqjyzh2pmd5ZAY@cluster0.wwkeyf8.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client['test']
    collection = db['test_lp']
    return collection