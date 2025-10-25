from fastapi import FastAPI
from database import Base, engine
from routers import auth,users,videos
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(name =  "StreamAuth", version=1.0)

Base.metadata.create_all(bind = engine)

origins = [
    "http://localhost:3000"]

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(videos.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     
    allow_credentials=True,     
    allow_methods=["*"],        
    allow_headers=["*"]         
)


@app.get("/")
def root():
    return {"message": "Welcome to StreamAuth API!"} 