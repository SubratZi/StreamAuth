from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from fastapi import  Depends, HTTPException, status, Cookie, Request, Response
from jose import jwt, JWTError, ExpiredSignatureError
import uuid, hashlib
from database import get_sessions
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from models import User,RefreshToken

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

# JWT settings
SECRET_KEY = "$2b$12$G2r6Pe3WzRDY26M0FKpx2e4PJUe1g0DbsU7QG46w1qvOPL4mz0SBa"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10
REFRESH_TOKEN_EXPIRE_DAYS = 7


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": int(expire.timestamp()), "iat": int(datetime.now(timezone.utc).timestamp())})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token() -> str:
    return str(uuid.uuid4())


def decode_token(token:str):
    payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM] )
    if "sub" not in payload:
        raise ValueError("Missing sub claim")
    return payload

def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(
    response: Response,
    request: Request,
    db: Session = Depends(get_sessions),
    token: str = Depends(oauth2_scheme),
    refresh_token: str | None = Cookie(None),
):
    try:
        payload = decode_token(token)
        username = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = (
            db.query(User)
            .filter(
                User.username == username,
                User.is_active == True,
            )
            .first()
        )

        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except ExpiredSignatureError:
        if not refresh_token:
            raise HTTPException(
                status_code=401,
                detail="Refresh token missing",
            )

        now = datetime.now(timezone.utc)

        hashed_token = hash_refresh_token(refresh_token)

        token_obj = (
            db.query(RefreshToken)
            .filter(
                RefreshToken.token_hash == hashed_token,
                RefreshToken.revoked == False,
                RefreshToken.expires_at > now,
            )
            .first()
        )

        if token_obj is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired refresh token",
            )

        user = token_obj.user

        new_access_token = create_access_token(
            {
                "sub": user.username,
                "roles": user.roles,
            }
        )

        new_refresh_token = create_refresh_token()

        token_obj.revoked = True
        token_obj.last_used = now

        db.add(
            RefreshToken(
                user_id=user.id,
                token_hash=hash_refresh_token(new_refresh_token),
                created_at=now,
                expires_at=now + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
                revoked=False,
            )
        )

        db.commit()

        request.state.new_access_token = new_access_token

        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        )

        return user

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )
<<<<<<< Updated upstream
        
def require_role(*allowed_roles):
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.roles not in allowed_roles:
            raise HTTPException(
                status_code =status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to do this action"
            )
        return current_user
    
    return role_checker

=======

def require_role(*allowed_roles):
    def role_checker(current_user=Depends(get_current_user)):
        if current_user.roles not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to do this action",
            )
        return current_user

    return role_checker
>>>>>>> Stashed changes
