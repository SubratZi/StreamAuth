from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    roles = Column(String(50), nullable=False, default = "default")
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_paid = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    refresh_tokens = relationship("RefreshToken", back_populates="user")
    videos = relationship("Video", back_populates = "owner")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token_hash = Column(String, unique=True,nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)
    last_used = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="refresh_tokens")

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    url = Column(String, unique=True, nullable = True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    uploaded_at = Column(DateTime, default=datetime.now(timezone.utc))

    owner= relationship("User", back_populates="videos")