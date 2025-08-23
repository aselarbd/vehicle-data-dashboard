from datetime import datetime

from sqlmodel import Field
from database import BaseDataModel


class VehicleList(BaseDataModel, table=True):
    vehicle_id : str


class VehicleData(BaseDataModel, table=True):
    timestamp : datetime = Field(index=True)
    speed : int | None = Field(default=None, ge=0)
    odometer : float | None = Field(default=None, ge=0)
    soc : int | None = Field(default=None) 
    elevation : int | None = Field(default=None)
    shift_state : str | None = Field(default=None)

    # Foreign key to VehicleList
    vehicle_list_id: int = Field(foreign_key="vehiclelist.id")
