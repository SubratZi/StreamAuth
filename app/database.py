from sqlmodel import Session,SQLModel,create_engine
from sqlalchemy.ext.declarative import declarative_base

sqlite_url = "sqlite:///./streamauth.db"

engine = create_engine(sqlite_url, connect_args={"check_same_thread":False})
Base = declarative_base()

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_sessions():
    with Session(engine) as session:
        yield session

