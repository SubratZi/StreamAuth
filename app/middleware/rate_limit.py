import redis
from fastapi import HTTPException
import os
 
r = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    password=os.getenv("REDIS_PASSWORD", None),
    db = 0,
    decode_responses=True,
)

FREE_LIMIT = 8
PAID_LIMIT = 100
WINDOW = 60 #in seconds

def get_rate_key(user_id:int):
    return f"rate_limit:{user_id}"

def check_rate_limit(user):

    # Unlimited for admin:
    if user.roles =="admin":
        return
    
    limit = PAID_LIMIT if user.is_paid  else FREE_LIMIT

    key = get_rate_key(user.id)

    current = r.incr(key)

    if current ==1:
        r.expire(key, WINDOW)
    
    if current > limit:
        ttl =r.ttl(key)

        raise HTTPException(
            status_code=429,
            detail={
                "message":"Rate Limit Exceeded",
                "limit": limit,
                "window_seconds": WINDOW,
                "retry_after": ttl,
            }
        )
