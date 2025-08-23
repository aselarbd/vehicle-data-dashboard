from fastapi import FastAPI

from configs import API_BASE
from vehicle.router import router as vehicle_router


app = FastAPI()

app.include_router(vehicle_router, prefix=API_BASE)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)