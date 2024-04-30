from time import sleep

from app.db.database import connect_user
from datetime import datetime

from app.models.pricing_model import price_model

user_collection = connect_user()

while True:
    users = user_collection.find()
    for user in users:
        portfolio = 0
        for player in user['portfolio']['players']:
            price = price_model(user['portfolio']['players'][player]['current_price'])
            shares = user['portfolio']['players'][player]['shares']
            value = price * shares
            portfolio += value
        total = portfolio + user['balance']
        user_collection.update_one(
            {'_id': user['_id']},
            {'$push': {
                'portfolio_history': {
                    'value': total,
                    'date': datetime.now()
                }
            }
            }
        )
    sleep(300)



