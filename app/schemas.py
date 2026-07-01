from pydantic import BaseModel, EmailStr
from datetime import datetime,timezone,timedelta

class UserCreate(BaseModel):
    username: str
    password: str
    email: str

class UserOut(BaseModel):
    user_id: int
    username: str
    email: EmailStr | None = None
    created_at: str
    access_token: str | None = None
    roles: str
    is_paid: bool

    class Config:
        from_attributes = True

    @staticmethod
    def from_orm(user, access_token: str | None = None):
        
        NPT = timezone(timedelta(hours=5, minutes=45))

        if user.created_at.tzinfo is None:
            utc_created = user.created_at.replace(tzinfo=timezone.utc)
        else:
            utc_created = user.created_at

        local_time = utc_created.astimezone(NPT)
        return UserOut(
        user_id=user.id,
        username=user.username,
        email=getattr(user, "email", None),
        created_at=local_time.strftime("%Y-%m-%d %H:%M:%S"),
        access_token=access_token,
        roles=user.roles,
        is_paid=user.is_paid,
        )

class Videolist(BaseModel):
    id:int
    title: str
    owner_id: int

class VideoOut(BaseModel):
    id: int
    title: str
    owner_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True