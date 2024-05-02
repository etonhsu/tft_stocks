import redis
from fastapi import HTTPException

# Configure Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)


def get_cache(key: str):
    try:
        value = redis_client.get(key)
        if value:
            return value
    except redis.RedisError as error:
        # Log the error as needed
        print(f"Redis error: {error}")
        raise HTTPException(status_code=500, detail="Internal server error")


def set_cache(key: str, value: str, expiration: int = 3600):
    try:
        redis_client.set(key, value, ex=expiration)
    except redis.RedisError as error:
        print(f"Redis error: {error}")
        raise HTTPException(status_code=500, detail="Internal server error")


def clear_cache(key: str):
    try:
        redis_client.delete(key)
        return {"status": "Cache cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))