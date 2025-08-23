from typing import Annotated, Any, List
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlmodel import select

from database import SessionDep
from vehicle.model import VehicleList
from vehicle.schema import FilterExportTypes, FilterVehicles, VehicleDataSchema, VehicleListOutputSchema
from vehicle.service import export_data, get_a_vehicle, get_all_vehicle_ids, get_vehicle_list, load_data_from_folder


# Create router with prefix for all vehicle_data routes
router = APIRouter(prefix="/vehicle_data", tags=["vehicle_data"])


@router.post('/populate', status_code=status.HTTP_201_CREATED)
def populate_data() -> Any:
    """Populate data to databse from files"""
    load_data_from_folder()


@router.get(
        '/{id}/',
        response_model=VehicleDataSchema, 
        status_code=status.HTTP_200_OK,
        responses={
               200: {"description": "Vehicle data retrieved successfully"},
               404: {"description": "Vehicle record not found"}
           },
        )
async def get_a_vehicle_data(id: int, session: SessionDep) -> Any:
    """Get a vehicle data by ID"""
    data = get_a_vehicle(id, session)
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle record not found")
    return data


@router.get(
        '/',
        response_model=VehicleListOutputSchema, 
        status_code=status.HTTP_200_OK,
        )
async def get_vehicle_data_list(filter_vehicles: Annotated[FilterVehicles, Query()], session: SessionDep) -> Any:
    """Get vehicle data list"""
    
    statement = select(VehicleList).where(VehicleList.vehicle_id == filter_vehicles.vehicle_id)
    results = session.exec(statement).first()

    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected Vehicle ID not found")
    
    vehicle_record_id = results.id
    data = get_vehicle_list(filter_vehicles, vehicle_record_id, session)

    return data
    


@router.get(
        '/export', 
        response_class=FileResponse,
           status_code=status.HTTP_200_OK,
           responses={
               200: {"description": "Vehicle data exported successfully as file"},
               404: {"description": "Selected Vehicle ID not found"}
           }
        )
async def export_vehicle_data(export_filter: Annotated[FilterExportTypes, Query()], session: SessionDep) -> Any:
    """Export vehicle data to different formats"""
    
    statement = select(VehicleList).where(VehicleList.vehicle_id == export_filter.vehicle_id)
    results = session.exec(statement).first()

    if not results:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Selected Vehicle ID not found")
    
    vehicle_record_id = results.id
    return export_data(export_filter, vehicle_record_id, session)


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