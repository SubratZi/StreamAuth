from fastapi import APIRouter, Depends, Request, Response
from security import get_current_user
from schemas import UserOut
from fastapi.responses import JSONResponse
from database import get_sessions
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["users"])
 
@router.get("/me", response_model= UserOut)
def read_profile(response: Response, request: Request, current_user=Depends(get_current_user)):
    access_token = getattr(request.state, "new_access_token", None)
    payload = UserOut.from_orm(current_user, access_token=access_token)
    return JSONResponse(content=payload.model_dump(), headers=response.headers)

@router.post("/upgrade")
def upgrade_to_paid(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_sessions)
):
    current_user.is_paid = True
    db.commit()
    db.refresh(current_user)
    return {"message": "Upgraded to paid successfully!", "is_paid": True}