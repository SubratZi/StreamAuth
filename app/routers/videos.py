import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_sessions
from models import Video
from schemas import Videolist, VideoOut
from security import get_current_user
from datetime import datetime,timezone
from limiter import limiter
from middleware.bandwidth import check_bandwidth, track_bandwidth
from middleware.stream_session import start_stream, end_stream

VIDEO_STORAGE = "videos/"
os.makedirs(VIDEO_STORAGE, exist_ok=True)

router = APIRouter(prefix="/videos", tags=["videos"])

@router.post("/upload", response_model=VideoOut)
async def create_video(file: UploadFile = File(...), db: Session = Depends(get_sessions), current_user=Depends(get_current_user)):
    video_path  = os.path.join(VIDEO_STORAGE, file.filename)
    with open(video_path, "wb") as f:
        f.write(await file.read())
    db_video = Video(title=file.filename, owner_id=current_user.id, uploaded_at = datetime.now(timezone.utc))
    db.add(db_video)
    db.commit() 
    db.refresh(db_video)
    return db_video

@router.get("/", response_model=list[Videolist])
def list_videos(db: Session = Depends(get_sessions)):
    videos = db.query(Video).all()
    return videos

@router.get("/{video_id}")
@limiter.limit("8/minute")
def get_video(video_id: int, request:Request, db: Session = Depends(get_sessions), current_user= Depends(get_current_user)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    path = os.path.join(VIDEO_STORAGE, video.title)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Video file missing")

    # Concurrent Streaming Check
    allowed = start_stream(user_id= current_user.id, is_paid = current_user.is_paid)
    if not allowed:
        if not current_user.is_paid: #For Free user
            raise HTTPException(
                status_code=403,
                detail = "Streaming Limit Exceeded, Please upgrade your plan!"
            )
        else:                       #For paid user
            raise HTTPException(
                status_code=403,
                detail = "Streaming Limit Exceeded, 3 devices streaming concurrently found!"
            )
    
    check_bandwidth(user_id= current_user.id, is_paid = current_user.is_paid)

    file_size = os.path.getsize(path)
    range_header = request.headers.get("range")
    start = 0
    end = file_size - 1

    if range_header:
        ranges = range_header.replace("bytes=", "").split("-")
        start = int(ranges[0])
        if ranges[1]:
            end = int(ranges[1])

    def iterfile():
        try:
            with open(path, "rb") as f:
                f.seek(start)
                chunk_size = 1024 * 1024  # 1MB
                bytes_to_send = end - start + 1
                while bytes_to_send > 0:
                    read_bytes = min(chunk_size, bytes_to_send)
                    data = f.read(read_bytes)
                    if not data:
                        break
                    bytes_to_send -= len(data)
                    track_bandwidth(user_id= current_user.id, bytes_sent=len(data))  
                    yield data
        finally:
            end_stream(user_id=current_user.id)

    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(end - start + 1),
        "Content-Type": "video/mp4"
    }

    return StreamingResponse(iterfile(), status_code=206 if range_header else 200, headers=headers)

@router.delete("/{video_id}")
def delete_video(video_id: int, db: Session = Depends(get_sessions), current_user=Depends(get_current_user)):
    video = db.query(Video).filter(Video.id == video_id, Video.owner_id == current_user.id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found or not owned by you")
    db.delete(video)
    db.commit()
    return {"message": "Video deleted"}