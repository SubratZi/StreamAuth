import os
import redis
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_sessions
from models import Video
from schemas import Videolist, VideoOut
from security import get_current_user, require_role
from datetime import datetime, timezone
from middleware.bandwidth import check_bandwidth, track_bandwidth
from middleware.stream_session import (start_stream, heartbeat_stream, end_stream, create_stream_session)
from middleware.rate_limit import check_rate_limit
from middleware.upload_bandwidth import (check_upload_bandwidth,track_upload_bandwidth,)

is_production = os.getenv("ENVIRONMENT", "development") == "production"

VIDEO_STORAGE = "videos/"
os.makedirs(VIDEO_STORAGE, exist_ok=True)

router = APIRouter(prefix="/videos", tags=["videos"])

@router.post("/upload", response_model=VideoOut)
async def create_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_sessions),
    current_user=Depends(require_role("admin")),
): 
    
    check_rate_limit(current_user, action="upload")
    check_upload_bandwidth(current_user)
    video_path = os.path.join(VIDEO_STORAGE, file.filename)

    try:
        with open(video_path, "wb") as buffer:
            while True:
                chunk = await file.read(1024 * 1024)  # 1 MB
                if not chunk:
                    break
                buffer.write(chunk)
                track_upload_bandwidth(current_user.id,len(chunk),)
    finally:
        await file.close()

    db_video = Video(
        title=file.filename,
        owner_id=current_user.id,
        uploaded_at=datetime.now(timezone.utc),
    )

    db.add(db_video)
    db.commit()
    db.refresh(db_video)

    return db_video

@router.get("/", response_model=list[Videolist])
def list_videos(db: Session = Depends(get_sessions)):
    videos = db.query(Video).all()
    return videos

@router.get("/{video_id}")
def get_video(
    video_id: int,
    request: Request,
    db: Session = Depends(get_sessions),
    current_user=Depends(get_current_user)
):
    if current_user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")

    check_rate_limit(current_user)

    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    path = os.path.join(VIDEO_STORAGE, video.title)
    session_id = request.cookies.get("stream_session")

    if not session_id:
        session_id = create_stream_session()

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Video file missing")

    # Concurrent Streaming Check
    if current_user.roles != "admin":
        allowed = start_stream(user_id=current_user.id, is_paid=current_user.is_paid, session_id=session_id)
        if not allowed:
            if not current_user.is_paid:
                raise HTTPException(status_code=403, detail="Streaming Limit Exceeded, Please upgrade your plan!")
            else:
                raise HTTPException(status_code=403, detail="Streaming Limit Exceeded, 3 devices streaming concurrently found!")

    check_bandwidth(current_user)

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
                chunk_size = 1024 * 1024
                bytes_to_send = end - start + 1
                while bytes_to_send > 0:
                    # 👈 Check bandwidth before each chunk
                    try:
                        check_bandwidth(current_user)
                    except HTTPException:
                        break  # 👈 stop streaming when limit hit
                    heartbeat_stream(session_id)
                    read_bytes = min(chunk_size, bytes_to_send)
                    data = f.read(read_bytes)
                    if not data:
                        break
                    bytes_to_send -= len(data)
                    track_bandwidth(user_id=current_user.id, bytes_sent=len(data))
                    yield data
        finally:
            end_stream(session_id)

    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(end - start + 1),
        "Content-Type": "video/mp4"
    }

    response = StreamingResponse(
        iterfile(),
        status_code=206 if range_header else 200,
        headers=headers,
    )

    response.set_cookie(
        key="stream_session",
        value=session_id,
        httponly=True,
        samesite="none",
        secure=is_production,
        max_age=3600,
    )

    return response

@router.delete("/{video_id}")
def delete_video(video_id: int, db: Session = Depends(get_sessions), current_user=Depends(get_current_user)):
    if current_user.roles == "admin":
        video = db.query(Video).filter(Video.id == video_id).first()
    else:
        video = db.query(Video).filter(Video.id == video_id, Video.owner_id == current_user.id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found or you dont have permission")

    path = os.path.join(VIDEO_STORAGE, video.title)
    if os.path.exists(path):
        os.remove(path)

    db.delete(video)
    db.commit()
    return {"message": "Video deleted"}