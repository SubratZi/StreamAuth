import redis
from fastapi import HTTPException

r = redis.Redis(host="localhost", port=6379, db= 0, socket_connect_timeout=5)

FREE_LIMIT = 5*1024*1024*1024
PAID_LIMIT = None

def get_bandwidth_key(user_id:int):
    return f"bandwidth:{user_id}"

def check_bandwidth(user_id:int, is_paid:bool):
    if is_paid:
        return
    
    key = get_bandwidth_key(user_id)
    used = r.get(key)
    used = int(used) if used else 0

    if used>=FREE_LIMIT:
        raise HTTPException(
            status_code= 403,
            detail="Bandwidth limit exceeded,Please Upgrade to paid plans."
        )

def track_bandwidth(user_id: int, bytes_sent: int):
    key = get_bandwidth_key(user_id)
    r.incrby(key, bytes_sent)
    r.expire(key, 30*24*60*60)