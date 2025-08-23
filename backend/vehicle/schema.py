from datetime import datetime
from pydantic import BaseModel


class VehicleDataSchema(BaseModel):
    id : int
    timestamp: datetime
    speed: int | None
    odometer: float
    soc: int 
    elevation: int
    shift_state: str | None