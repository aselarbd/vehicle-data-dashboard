from contextlib import asynccontextmanager
from fastapi import FastAPI

from configs import API_BASE
from database import create_db_and_tables
from vehicle.router import router as vehicle_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create Database models on startup
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(vehicle_router, prefix=API_BASE)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)