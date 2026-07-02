import os
import redis
from fastapi import HTTPException

r = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    password=os.getenv("REDIS_PASSWORD", None),
    db=0,
    decode_responses=True,
)

ADMIN_UPLOAD_LIMIT = 500 * 1024 * 1024


def get_upload_key(user_id: int):
    return f"upload_bandwidth:{user_id}"


def check_upload_bandwidth(user):
    # Only admins can upload
    if user.roles != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admins can upload videos.",
        )

    key = get_upload_key(user.id)

    used = r.get(key)
    used = int(used) if used else 0

    if used >= ADMIN_UPLOAD_LIMIT:
        raise HTTPException(
            status_code=403,
            detail={
                "message": "Monthly upload bandwidth exceeded.",
                "limit_bytes": ADMIN_UPLOAD_LIMIT,
                "used_bytes": used,
            },
        )


def track_upload_bandwidth(user_id: int, bytes_uploaded: int):
    key = get_upload_key(user_id)

    r.incrby(key, bytes_uploaded)

    # Reset after 30 days
    r.expire(key, 30 * 24 * 60 * 60)


def get_upload_usage(user_id: int):
    key = get_upload_key(user_id)

    used = r.get(key)

    return int(used) if used else 0


def reset_upload_usage(user_id: int):
    r.delete(get_upload_key(user_id))