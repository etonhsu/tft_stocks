from datetime import timedelta

from app.db.database import connect_user

user_collection = connect_user()


def portfolio_change(user_data: dict):
    portfolio_history = user_data.get('portfolio_history', [])

    print(f"Portfolio history before calculating changes: {portfolio_history}")

    # Calculate changes in the portfolio value
    if len(portfolio_history) >= 2:
        last_value = portfolio_history[-1]['value']
        first_value = portfolio_history[0]['value']

        # Calculate the 1-day change, defaulting to first_value if not enough entries
        one_day_ago_value = next((item['value'] for item in reversed(portfolio_history)
                                  if item['date'] <= portfolio_history[-1]['date'] - timedelta(days=1)), first_value)
        one_day_change = last_value - one_day_ago_value
        user_data['one_day_change'] = one_day_change

        # Calculate the 3-day change, defaulting to first_value if not enough entries
        three_days_ago_value = next((item['value'] for item in reversed(portfolio_history)
                                     if item['date'] <= portfolio_history[-1]['date'] - timedelta(days=3)), first_value)
        three_day_change = last_value - three_days_ago_value
        user_data['three_day_change'] = three_day_change
    else:
        # If there's only one entry or none, no change is possible
        user_data['one_day_change'] = None
        user_data['three_day_change'] = None

    print(f"User data after calculating portfolio changes: {user_data}")
    return user_data
