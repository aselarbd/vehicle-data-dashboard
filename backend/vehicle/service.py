import glob
import json
import os
from typing import Annotated, List, Optional

from fastapi import Query
from fastapi.responses import FileResponse
import pandas as pd
from sqlmodel import Session, func, select

from configs import DATA_PATH
from database import SessionDep, engine
from vehicle.model import VehicleData, VehicleList
from vehicle.schema import ExportTypes, FilterExportTypes, FilterVehicles




def load_data_from_folder() -> None:
    """Load data from the folder"""

    # Get existing vehicle IDs from database at the beginning
    with Session(engine) as session:
        existing_vehicle_ids = set()
        statement = select(VehicleList.vehicle_id)
        results = session.exec(statement).all()
        existing_vehicle_ids = set(results)

    # Load files
    csv_files = glob.glob(os.path.join(DATA_PATH, "*.csv"))

    # Load data to data array, skip files that already exist in DB
    data = []
    for csv_file in csv_files:
        file_id = os.path.splitext(os.path.basename(csv_file))[0]

        # Skip if this file_id already exists in database
        if file_id in existing_vehicle_ids:
            continue
        
        data.append({
            'vehicle_id': VehicleList(vehicle_id=file_id),
            'vehicle_data': pd.read_csv(csv_file)
        })
    
    # If no new data, return early
    if not data:
        return
    
    # Add data to database
    vehicle_list = [d['vehicle_id'] for d in data]
    saved_vehicle_list = VehicleList.save_all(vehicle_list)

    all_vehicle_data = []
    
    for i, d in enumerate(data):
        df = d['vehicle_data']
        saved_vehicle = saved_vehicle_list[i]  # Get corresponding saved vehicle
        
        # Convert each DataFrame row to VehicleData object
        for _, row in df.iterrows():
            vehicle_data = VehicleData(
                timestamp=pd.to_datetime(row['timestamp']),
                speed=None if pd.isna(row['speed']) else int(row['speed']),
                odometer=None if pd.isna(row['odometer']) else float(row['odometer']),
                soc=None if pd.isna(row['soc']) else int(row['soc']),
                elevation=None if pd.isna(row['elevation']) else int(row['elevation']),
                shift_state=None if pd.isna(row['shift_state']) else str(row['shift_state']),
                vehicle_list_id=saved_vehicle.id  # Foreign key link
            )
            all_vehicle_data.append(vehicle_data)
    
    # Bulk save all VehicleData objects
    VehicleData.save_all(all_vehicle_data)


def get_all_vehicle_ids(session: SessionDep) -> List[VehicleList]:
    """Get all vehicle IDs from the VehicleList table"""
    
    statement = select(VehicleList)
    results = session.exec(statement).all()

    return list(results)

def get_a_vehicle(id: int, session: SessionDep) -> Optional[VehicleData]:
    """"Get a vehicle data by ID from VehicleData table"""
    
    return session.get(VehicleData, id)

def get_vehicle_list(filter_vehicles: Annotated[FilterVehicles, Query()], vehicle_record_id: int, session: SessionDep) -> Optional[List[VehicleData]]:
    """Get filtered list of vehicles"""
    
    # Build the main query for VehicleData
    statement = select(VehicleData).where(VehicleData.vehicle_list_id == vehicle_record_id)
    count_statement = select(func.count(VehicleData.id)).where(VehicleData.vehicle_list_id == vehicle_record_id)

    # Apply timestamp filters if provided
    if filter_vehicles.initial:
        statement = statement.where(VehicleData.timestamp >= filter_vehicles.initial)
        count_statement = count_statement.where(VehicleData.timestamp >= filter_vehicles.initial)
    
    if filter_vehicles.final:
        statement = statement.where(VehicleData.timestamp <= filter_vehicles.final)
        count_statement = count_statement.where(VehicleData.timestamp <= filter_vehicles.final)
    
    # Apply ordering by timestamp for consistent pagination
    statement = statement.order_by(VehicleData.timestamp)
    
    # Apply offset and limit
    statement = statement.offset(filter_vehicles.page * filter_vehicles.limit).limit(filter_vehicles.limit)
    
    # Execute the query only once
    count = session.exec(count_statement).one()
    results = session.exec(statement).all()
    
    return { 'count': count,'data': list(results)}

def export_data(export_filter: Annotated[FilterExportTypes, Query()], vehicle_record_id: int, session: SessionDep):
    
    # Build the main query for VehicleData
    statement = select(VehicleData).where(VehicleData.vehicle_list_id == vehicle_record_id)

    # Execute the query only once
    results = session.exec(statement).all()
    file_name = export_filter.vehicle_id
    
    # Create exports directory if it doesn't exist
    export_dir = "exports"
    os.makedirs(export_dir, exist_ok=True)
    
    # Convert results to data_list (common for all export types)
    data_list = []
    for result in results:
        data_dict = {
            "id": result.id,
            "timestamp": result.timestamp,
            "speed": result.speed,
            "odometer": result.odometer,
            "soc": result.soc,
            "elevation": result.elevation,
            "shift_state": result.shift_state,
            "vehicle_list_id": result.vehicle_list_id
        }
        data_list.append(data_dict)

    if export_filter.export_type == ExportTypes.JSON.value:
        # Convert timestamps to ISO format for JSON serialization
        json_data = []
        for data_dict in data_list:
            json_dict = data_dict.copy()
            json_dict["timestamp"] = data_dict["timestamp"].isoformat()
            json_data.append(json_dict)
        
        file_path = os.path.join(export_dir, f"{file_name}.json")
        with open(file_path, 'w') as f:
            json.dump(json_data, f, indent=2, default=str)
        
        return FileResponse(
            path=file_path,
            filename=f"{file_name}.json",
            media_type='application/json'
        )

    elif export_filter.export_type == ExportTypes.CSV.value:
        df = pd.DataFrame(data_list)
        file_path = os.path.join(export_dir, f"{file_name}.csv")
        df.to_csv(file_path, index=False)
        
        return FileResponse(
            path=file_path,
            filename=f"{file_name}.csv",
            media_type='text/csv'
        )

    elif export_filter.export_type == ExportTypes.EXCEL.value:
        df = pd.DataFrame(data_list)
        file_path = os.path.join(export_dir, f"{file_name}.xlsx")
        df.to_excel(file_path, index=False, engine='openpyxl')
        
        return FileResponse(
            path=file_path,
            filename=f"{file_name}.xlsx",
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )