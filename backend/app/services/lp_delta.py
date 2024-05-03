from app.db.database import connect_lp
from datetime import datetime, timedelta
from time import sleep
from app.models.pricing_model import price_model

def find_closest_lp(target_time, date_times, league_points):
    # Determine the valid length for index operations
    valid_length = min(len(date_times), len(league_points))
    if valid_length == 0:
        return None  # Return None if either list is empty

    # Restrict the index range to the length of the shorter list
    valid_indices = range(valid_length)

    # Find the index of the closest time that is less than or equal to the target time within the valid range
    try:
        closest_index = min(
            (i for i in valid_indices if date_times[i] <= target_time),
            key=lambda i: abs(date_times[i] - target_time),
            default=0  # Use the oldest available entry as a default
        )
    except ValueError:
        # If no valid indices are found, default to the oldest in the valid range
        closest_index = 0

    return league_points[closest_index]

def calculate_delta():
    lp_collection = connect_lp()
    documents = lp_collection.find()

    for doc in documents:
        # Safely convert date strings to datetime objects
        try:
            date_times = [datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S.%f") for date_str in doc['date']]
        except ValueError:
            print(f"Date format error in document {doc['_id']}")
            continue  # Skip this document or handle the error as needed

        current_lp = doc['leaguePoints'][-1] if doc['leaguePoints'] else None
        current_date = date_times[-1] if date_times else None

        if not current_lp or not current_date:
            continue  # Skip calculations if essential data is missing

        # Define the times to check
        time_8h = current_date - timedelta(hours=8)
        time_24h = current_date - timedelta(hours=24)
        time_72h = current_date - timedelta(hours=72)

        # Find the closest date entry to the specified times
        lp_8h = find_closest_lp(time_8h, date_times, doc['leaguePoints'])
        lp_24h = find_closest_lp(time_24h, date_times, doc['leaguePoints'])
        lp_72h = find_closest_lp(time_72h, date_times, doc['leaguePoints'])

        # Calculate deltas
        delta_8h = price_model(current_lp) - price_model(lp_8h) if lp_8h else None
        delta_24h = price_model(current_lp) - price_model(lp_24h) if lp_24h else None
        delta_72h = price_model(current_lp) - price_model(lp_72h) if lp_72h else None

        # Update the database with the newest deltas
        summoner_Id = doc['summonerId']
        update_data = {'$set': {}}
        if delta_8h is not None:
            update_data['$set']['delta_8h'] = delta_8h
        if delta_24h is not None:
            update_data['$set']['delta_24h'] = delta_24h
        if delta_72h is not None:
            update_data['$set']['delta_72h'] = delta_72h

        if update_data['$set']:
            lp_collection.update_one({'summonerId': summoner_Id}, update_data)

if __name__ == "__main__":
    while True:
        calculate_delta()
        sleep(300)  # Run every hour, adjust as necessary
