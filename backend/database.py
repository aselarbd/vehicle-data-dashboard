from typing import Annotated
from fastapi import Depends
from sqlmodel import Field, Session, SQLModel, create_engine, select


class BaseDataModel(SQLModel):
    """Base database table that all other tables can extend"""
    id: int | None = Field(
        default=None, 
        primary_key=True,
        index=True,
        description="Autoincrement integer primary key",
        )
    
    def save(self) -> 'BaseDataModel':
        """Save the current instance to the database"""
        with Session(engine) as session:
            session.add(self)
            session.commit()
            session.refresh(self)
            return self
        
    @classmethod
    def save_all(cls, items: list['BaseDataModel']) -> list['BaseDataModel']:
        """Save multiple instances to the database"""
        if not items:
            return []
        
        with Session(engine) as session:
            saved_items = []
            for item in items:
                session.add(item)
                saved_items.append(item)
            session.commit()
            for item in saved_items:
                session.refresh(item)
            return saved_items
    
    @classmethod
    def get_all(cls) -> list['BaseDataModel']:
        """Get all records for this model"""
        with Session(engine) as session:
            statement = select(cls)
            results = session.exec(statement).all()
            return list(results)

database_url = f'sqlite:///vehicle_db.db'

connect_args = {"check_same_thread": False}
engine = create_engine(database_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]