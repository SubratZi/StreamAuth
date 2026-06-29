import redis
r= redis.Redis(host="localhost", port = 6379, db = 0)

#Number of concurrent streaming devices
FREE_STREAMING_LIMIT = 1
PAID_STREAMING_LIMIT = 4 

def get_session_key(user_id: str):
    return f"active streams:{user_id}"

def start_stream(user_id, is_paid):
    
    key = get_session_key(user_id)
    limit = PAID_STREAMING_LIMIT if is_paid else FREE_STREAMING_LIMIT
    active = r.incr(key)
    r.expire(key, 60*60)

    if active > limit:
        r.decr(key)
        return False
    
    return True

def end_stream(user_id):

    key = get_session_key(user_id)
    active = r.get(key)
    if active and int(active)>0 :
        r.decr(key)

