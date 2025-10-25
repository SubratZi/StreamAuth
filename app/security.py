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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(response: Response, request:Request, db: Session = Depends(get_sessions), token:str = Depends(oauth2_scheme), refresh_token:str =Cookie(None)):
    try:
        payload = decode_token(token)
        username = payload.get("sub")
        user = db.query(User).filter(User.username == username, User.is_active==True).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
        
    except ExpiredSignatureError:
        now = datetime.now(timezone.utc)
        if refresh_token:
            hased_token = hash_refresh_token(refresh_token)
            token_obj = (
            db.query(RefreshToken)
            .filter(
                RefreshToken.token_hash == hased_token,
                RefreshToken.revoked == False,
                RefreshToken.expires_at > now
            )
            .first()
            )
            if token_obj:
                user = token_obj.user
                roles = user.roles
                new_access_token = create_access_token({"sub":user.username, "roles":roles})
                new_refresh_token = create_refresh_token()
                new_refresh_token_hash = hash_refresh_token(new_refresh_token)
                request.state.new_access_token = new_access_token
                response.set_cookie(
                    key="refresh_token",
                    value=new_refresh_token,
                    httponly=True,
                    secure=False,
                    samesite="lax",
                    max_age=REFRESH_TOKEN_EXPIRE_DAYS*24*60*60
                )

                new_refresh_obj = RefreshToken( 
                    user_id=user.id,
                    token_hash=new_refresh_token_hash,
                    created_at=now,
                    expires_at=now + timedelta(days=7),
                    revoked=False
                )
                db.add(new_refresh_obj)
                token_obj.revoked = True
                token_obj.last_used = now
                db.commit()
                return user 
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    except JWTError:
      raise HTTPException(status_code=401, detail="Invalid token")