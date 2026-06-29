# StreamAuth

StreamAuth is a scalable, token-authenticated video-serving API designed for multi-user systems. It handles secure content access, user roles, and rate-limited streaming, subscription-tier based streaming services and smooth streaming. Free-plan to Subscription-Planned system where users can get services according to their tier.Features like: Concurrent Streaming, Rate limiting, Bandwidth Limiting, Proper Authentication and Authorization are added till the date.

## Features
- Authentication
- Authorization
- Tier based user roles
- Rate limited video serving
- Bandwidth limiting
- Concurrent Streaming limiting

## Tech Stack
- Backend: FastAPI(Python)
- Database: Mysqlite(SQLAlchemy)
- Frontend: Yet more to come
- Cache: Redis
- Auth: JWT

## Project Structure
StreamAUTH/
-app/
--middleware/
---bandwidth.py
---stream_session.py
--routers/
---auth.py
---users.py
---videos.py
--main.py
--models.py
--security.py
--database.py
--limiter.py
--schemas.py
-frontend/
-README.md
-requirements.txt

# API-Endpoints
## Auth: (POST REQUESTS)
- /auth/register
- /auth/login 

## Videos:
- /videos/ (GET REQUEST)
- /videos/{id} (GET REQUEST)
- /videos/upload (POST REQUEST)

## Rate-Limit & Plans:
### Rate-Limiting:
- Free-users: Only 8 requests/min
- Paid-users: Unlimited requests

### Bandwidth-Limiting:
- Free-users: Only 5GB in 1 month
- Paid-users: Unlimited Bandwidth

### Concurrent-Streaming:
- Free-users: Only 1 device concurrently
- Paid-users: Maximum of 3 concurrent streaming feature

## Liscense
- MIT License (See LICENSE for details)