from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from schemas import UserCreate
import os
from database import get_sessions
from models import User, RefreshToken
from security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    hash_refresh_token,
    get_current_user
)

is_production = os.getenv("ENVIRONMENT", "development") == "production"

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_sessions)):
    # Check if user exists
    if db.query(User).filter((User.username == user.username) | (User.email == user.email)).first():
        raise HTTPException(status_code=400, detail="Username or email already exists")

    # Hash password and create user
    hashed_pwd = hash_password(user.password)
    user = User(username=user.username, email=user.email, hashed_password=hashed_pwd)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User created successfully", "user_id": user.username}

@router.post("/login")
def login(response: Response, form_data: OAuth2PasswordRequestForm= Depends(), db: Session = Depends(get_sessions)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create access token
    access_token = create_access_token({"sub": user.username})

    # Create refresh token
    raw_refresh_token = create_refresh_token()
    hashed_token = hash_refresh_token(raw_refresh_token)
    refresh_token_obj = RefreshToken(
        user_id=user.id,
        token_hash=hashed_token,
        revoked = False,
        created_at=datetime.now(timezone.utc),
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    db.add(refresh_token_obj)
    db.commit()

    response.set_cookie(
        key="refresh_token",
        value=raw_refresh_token,
        httponly=True,
        secure=is_production,
        samesite="lax",
        max_age=7*24*60*60
    )

    return {"access_token": access_token, "user": {"id": user.id, "username": user.username,"email": user.email,"role": user.roles,"is_paid": user.is_paid}}

@router.post("/logout")
def logout(response: Response, refresh_token: str = Cookie(None), db: Session = Depends(get_sessions)):
    if refresh_token:
        hashed_token = hash_refresh_token(refresh_token)
        token_obj = db.query(RefreshToken).filter(RefreshToken.token_hash == hashed_token).first()
        if token_obj:
            token_obj.revoked = True
            db.commit()
            response.delete_cookie(key="refresh_token")
            return {"message": "Logged out successfully"}
    else:
        return{"message":"No valid refresh token provided"}
    # Remove cookie
    

def get_my_profile(current=Depends(get_current_user), request: Request = None):
    user = current["user"]
    response = {
        "username": user.username,
        "email": user.email,
        "roles": user.roles
    }
    if hasattr(request.state ,"new_access_token"):
        response["access_token"] = request.state.new_access_token
    return response

