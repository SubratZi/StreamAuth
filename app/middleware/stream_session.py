import redis
import uuid
import os

r = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"),port=int(os.getenv("REDIS_PORT", 6379)),password=os.getenv("REDIS_PASSWORD", None), db=0, decode_responses=True)

FREE_STREAMING_LIMIT = 1
PAID_STREAMING_LIMIT = 4

STREAM_TIMEOUT = 3600


def get_user_key(user_id: int):
    return f"active_streams:{user_id}"


def get_session_key(session_id: str):
    return f"stream_session:{session_id}"


def create_stream_session():
    return str(uuid.uuid4())


def start_stream(user_id: int, is_paid: bool, session_id: str):
    session_key = get_session_key(session_id)

    # Existing browser session
    if r.exists(session_key):
        r.expire(session_key, STREAM_TIMEOUT)
        return True

    user_key = get_user_key(user_id)
    limit = PAID_STREAMING_LIMIT if is_paid else FREE_STREAMING_LIMIT

    active = r.get(user_key)
    active = int(active) if active else 0

    if active >= limit:
        return False

    pipe = r.pipeline()

    pipe.incr(user_key)
    pipe.expire(user_key, STREAM_TIMEOUT)

    pipe.set(session_key, user_id)
    pipe.expire(session_key, STREAM_TIMEOUT)

    pipe.execute()

    return True


def heartbeat_stream(session_id: str):
    session_key = get_session_key(session_id)

    if r.exists(session_key):
        r.expire(session_key, STREAM_TIMEOUT)

        user_id = r.get(session_key)
        if user_id:
            r.expire(get_user_key(int(user_id)), STREAM_TIMEOUT)


def end_stream(session_id: str):
    # Don't immediately close the session.
    # Let it expire naturally so browser range requests
    # and refreshes reuse the same session.
    heartbeat_stream(session_id)