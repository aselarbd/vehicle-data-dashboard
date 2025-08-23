import glob
import os

import pandas as pd

from configs import DATA_PATH
from vehicle.model import VehicleData, VehicleList




def load_data_from_folder() -> None:
    """Load data from the folder"""

    # Load files
    csv_files = glob.glob(os.path.join(DATA_PATH, "*.csv"))

    # Load data to data array, skip files that already exist in DB
    data = []
    for csv_file in csv_files:
        file_id = os.path.splitext(os.path.basename(csv_file))[0]

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
