import redis
from fastapi import HTTPException
import os

r = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"),port=int(os.getenv("REDIS_PORT", 6379)),password=os.getenv("REDIS_PASSWORD", None), db= 0, decode_responses=True)

FREE_LIMIT = 500*1024*1024
PAID_LIMIT = 5*1024*1024*1024

def get_bandwidth_key(user_id:int):
    return f"bandwidth:{user_id}"

def check_bandwidth(user):
    if user.roles == "admin":
        return
    limit = PAID_LIMIT if user.is_paid else FREE_LIMIT

    key = get_bandwidth_key(user.id)
    used = r.get(key)
    used = int(used) if used else 0

    if used >= limit:
        raise HTTPException(
            status_code=403,
            detail={
                "message":"Bandwidth limit reached or exceeded",
                "limit_bytes":limit,
                "used_bytes": used,
            },
        )
    
def track_bandwidth(user_id: int, bytes_sent: int):
    key = get_bandwidth_key(user_id)
    r.incrby(key, bytes_sent)
    r.expire(key, 30*24*60*60)