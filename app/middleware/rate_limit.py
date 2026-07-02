import os
import time
import redis
from fastapi import HTTPException

r = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    password=os.getenv("REDIS_PASSWORD", None),
    db=0,
    decode_responses=True,
)

# ---------- Streaming limits ----------
FREE_STREAM_LIMIT = (8, 60)          
PAID_STREAM_LIMIT = (30, 60)         

# ---------- Upload limits ----------
FREE_UPLOAD_LIMIT = (5, 3600)        
PAID_UPLOAD_LIMIT = (50, 3600)       


def _check_limit(key: str, limit: int, window: int):
    now = time.time()
    pipe = r.pipeline()

    pipe.zremrangebyscore(key, 0, now - window)
    pipe.zcard(key)

    _, current = pipe.execute()

    if current >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Try again later.",
        )

    pipe = r.pipeline()
    pipe.zadd(key, {str(now): now})
    pipe.expire(key, window)
    pipe.execute()


def check_rate_limit(user, action: str = "stream"):
    """
    action:
        - "stream" -> GET /videos/{id}
        - "upload" -> POST /videos/upload
    """

    # Admin bypass
    if user.roles == "admin":
        return

    if action == "stream":
        limit, window = (
            PAID_STREAM_LIMIT
            if user.is_paid
            else FREE_STREAM_LIMIT
        )
    elif action == "upload":
        limit, window = (
            PAID_UPLOAD_LIMIT
            if user.is_paid
            else FREE_UPLOAD_LIMIT
        )
    else:
        return

    key = f"rate_limit:{action}:{user.id}"

    _check_limit(key, limit, window)