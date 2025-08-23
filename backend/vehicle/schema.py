from datetime import datetime
from typing import List
from pydantic import BaseModel, Field


class VehicleDataSchema(BaseModel):
    id : int
    timestamp: datetime
    speed: int | None
    odometer: float
    soc: int 
    elevation: int
    shift_state: str | None

class VehicleListOutputSchema(BaseModel):
    data : List[VehicleDataSchema]
    count : int

class FilterVehicles(BaseModel):
    vehicle_id: str = Field(min_length=1)
    initial: datetime | None = None
    final: datetime | None = None
    page: int = Field(0, ge=0)
    limit: int = Field(10, ge=0, le=20)