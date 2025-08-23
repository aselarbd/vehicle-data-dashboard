from typing import Any, List
from fastapi import APIRouter, status

from database import SessionDep
from vehicle.service import get_all_vehicle_ids, load_data_from_folder


# Create router with prefix for all vehicle_data routes
router = APIRouter(prefix="/vehicle_data", tags=["vehicle_data"])


@router.post('/populate', status_code=status.HTTP_201_CREATED)
def populate_data() -> Any:
    """Populate data to databse from files"""
    load_data_from_folder()


@router.get('/{id}/', status_code=status.HTTP_200_OK)
async def get_a_vehicle_data(id: int) -> Any:
    """Get a vehicle data by ID"""
    pass


@router.get('/', status_code=status.HTTP_200_OK,)
async def get_vehicle_data_list() -> Any:
    """Get vehicle data list"""
    pass
    


@router.get('/export', status_code=status.HTTP_200_OK)
async def export_vehicle_data() -> Any:
    """Export vehicle data to different formats"""
    pass


@router.get(
        '/vehicle_ids', 
        response_model=List, 
        status_code=status.HTTP_200_OK,
        responses={
               200: {"description": "Vehicle IDs retrieved successfully"}
        },
        )
async def get_vehicle_ids(session: SessionDep) -> Any:
    """Get all vehicle IDs from the VehicleList table"""
    vehicle_records = get_all_vehicle_ids(session)
    return [record.vehicle_id for record in vehicle_records]