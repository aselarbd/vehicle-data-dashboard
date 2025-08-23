import os
import pandas as pd
import unittest
from unittest import mock

from vehicle.service import load_data_from_folder


class TestLoadDataFromFolder(unittest.TestCase):
    """Test cases for load_data_from_folder function with all database calls mocked."""

    @mock.patch('vehicle.service.glob.glob')
    @mock.patch('vehicle.model.VehicleList.save_all')
    @mock.patch('vehicle.model.VehicleData.save_all')
    def test_no_csv_files_found(self, mock_data_save_all, mock_list_save_all, mock_glob):
        """Test that function handles empty directory gracefully."""
        # Setup: No CSV files found
        mock_glob.return_value = []
        
        # Execute
        load_data_from_folder()
        
        # Assertions
        mock_list_save_all.assert_not_called()
        mock_data_save_all.assert_not_called()

    @mock.patch('vehicle.service.glob.glob')
    @mock.patch('vehicle.service.pd.read_csv')
    @mock.patch('vehicle.model.VehicleList.save_all')
    @mock.patch('vehicle.model.VehicleData.save_all')
    def test_single_valid_csv_file(self, mock_data_save_all, mock_list_save_all, mock_read_csv, mock_glob):
        """Test successful processing of one valid CSV file."""
        # Setup: Single CSV file with valid data
        mock_glob.return_value = ['/fake/path/vehicle1.csv']
        mock_df = pd.DataFrame({
            'timestamp': ['2025-08-23T12:00:00Z', '2025-08-23T12:01:00Z'],
            'speed': [50, 60],
            'odometer': [1000.5, 1001.0],
            'soc': [80, 79],
            'elevation': [200, 210],
            'shift_state': ['D', 'D']
        })
        mock_read_csv.return_value = mock_df
        mock_saved_vehicle = mock.Mock(id=1)
        mock_list_save_all.return_value = [mock_saved_vehicle]
        
        # Execute
        load_data_from_folder()
        
        # Assertions
        mock_list_save_all.assert_called_once()
        mock_data_save_all.assert_called_once()
        
        # Verify VehicleList.save_all was called with correct data
        vehicle_list_arg = mock_list_save_all.call_args[0][0]
        self.assertEqual(len(vehicle_list_arg), 1)
        self.assertEqual(vehicle_list_arg[0].vehicle_id, 'vehicle1')
        
        # Verify VehicleData.save_all was called with correct data
        vehicle_data_arg = mock_data_save_all.call_args[0][0]
        self.assertEqual(len(vehicle_data_arg), 2)  # 2 rows in DataFrame
        self.assertEqual(vehicle_data_arg[0].vehicle_list_id, 1)
        self.assertEqual(vehicle_data_arg[1].vehicle_list_id, 1)

    @mock.patch('vehicle.service.glob.glob')
    @mock.patch('vehicle.service.pd.read_csv')
    @mock.patch('vehicle.model.VehicleList.save_all')
    @mock.patch('vehicle.model.VehicleData.save_all')
    def test_multiple_csv_files(self, mock_data_save_all, mock_list_save_all, mock_read_csv, mock_glob):
        """Test processing multiple CSV files."""
        # Setup: Multiple CSV files
        mock_glob.return_value = ['/fake/path/vehicle1.csv', '/fake/path/vehicle2.csv']
        mock_df1 = pd.DataFrame({
            'timestamp': ['2025-08-23T12:00:00Z'],
            'speed': [50],
            'odometer': [1000.5],
            'soc': [80],
            'elevation': [200],
            'shift_state': ['D']
        })
        mock_df2 = pd.DataFrame({
            'timestamp': ['2025-08-23T13:00:00Z'],
            'speed': [40],
            'odometer': [2000.0],
            'soc': [70],
            'elevation': [150],
            'shift_state': ['P']
        })
        mock_read_csv.side_effect = [mock_df1, mock_df2]
        mock_saved_vehicle1 = mock.Mock(id=1)
        mock_saved_vehicle2 = mock.Mock(id=2)
        mock_list_save_all.return_value = [mock_saved_vehicle1, mock_saved_vehicle2]
        
        # Execute
        load_data_from_folder()
        
        # Assertions
        mock_list_save_all.assert_called_once()
        mock_data_save_all.assert_called_once()
        
        # Verify correct number of VehicleList objects
        vehicle_list_arg = mock_list_save_all.call_args[0][0]
        self.assertEqual(len(vehicle_list_arg), 2)
        self.assertEqual(vehicle_list_arg[0].vehicle_id, 'vehicle1')
        self.assertEqual(vehicle_list_arg[1].vehicle_id, 'vehicle2')
        
        # Verify all VehicleData objects have proper vehicle_list_id assignments
        vehicle_data_arg = mock_data_save_all.call_args[0][0]
        self.assertEqual(len(vehicle_data_arg), 2)  # 1 row from each file
        self.assertEqual(vehicle_data_arg[0].vehicle_list_id, 1)  # First vehicle
        self.assertEqual(vehicle_data_arg[1].vehicle_list_id, 2)  # Second vehicle

    @mock.patch('vehicle.service.glob.glob')
    @mock.patch('vehicle.service.pd.read_csv')
    @mock.patch('vehicle.model.VehicleList.save_all')
    @mock.patch('vehicle.model.VehicleData.save_all')
    def test_csv_with_missing_values(self, mock_data_save_all, mock_list_save_all, mock_read_csv, mock_glob):
        """Test handling of NaN/None values in CSV."""
        # Setup: CSV with NaN values
        mock_glob.return_value = ['/fake/path/vehicle_with_nans.csv']
        mock_df = pd.DataFrame({
            'timestamp': ['2025-08-23T12:00:00Z', '2025-08-23T12:01:00Z'],
            'speed': [50, pd.NA],
            'odometer': [1000.5, pd.NA],
            'soc': [pd.NA, 70],
            'elevation': [200, pd.NA],
            'shift_state': ['D', pd.NA]
        })
        mock_read_csv.return_value = mock_df
        mock_saved_vehicle = mock.Mock(id=1)
        mock_list_save_all.return_value = [mock_saved_vehicle]
        
        # Execute
        load_data_from_folder()
        
        # Assertions
        mock_list_save_all.assert_called_once()
        mock_data_save_all.assert_called_once()
        
        # Verify NaN values converted to None in VehicleData objects
        vehicle_data_arg = mock_data_save_all.call_args[0][0]
        self.assertEqual(len(vehicle_data_arg), 2)
        
        # First row: speed=50, others have values
        self.assertEqual(vehicle_data_arg[0].speed, 50)
        self.assertEqual(vehicle_data_arg[0].odometer, 1000.5)
        self.assertIsNone(vehicle_data_arg[0].soc)  # NaN -> None
        self.assertEqual(vehicle_data_arg[0].elevation, 200)
        self.assertEqual(vehicle_data_arg[0].shift_state, 'D')
        
        # Second row: speed=None, soc=70, others are None
        self.assertIsNone(vehicle_data_arg[1].speed)  # NaN -> None
        self.assertIsNone(vehicle_data_arg[1].odometer)  # NaN -> None
        self.assertEqual(vehicle_data_arg[1].soc, 70)
        self.assertIsNone(vehicle_data_arg[1].elevation)  # NaN -> None
        self.assertIsNone(vehicle_data_arg[1].shift_state)  # NaN -> None

    @mock.patch('vehicle.service.glob.glob')
    @mock.patch('vehicle.service.pd.read_csv')
    @mock.patch('vehicle.model.VehicleList.save_all')
    @mock.patch('vehicle.model.VehicleData.save_all')
    def test_csv_with_mixed_data_types(self, mock_data_save_all, mock_list_save_all, mock_read_csv, mock_glob):
        """Test type conversion handling."""
        # Setup: CSV with mixed data types
        mock_glob.return_value = ['/fake/path/mixed_types.csv']
        mock_df = pd.DataFrame({
            'timestamp': ['2025-08-23T12:00:00Z'],
            'speed': ['50'],  # String number
            'odometer': [1000],  # Integer instead of float
            'soc': [80.5],  # Float instead of int
            'elevation': ['200'],  # String number
            'shift_state': ['D']
        })
        mock_read_csv.return_value = mock_df
        mock_saved_vehicle = mock.Mock(id=1)
        mock_list_save_all.return_value = [mock_saved_vehicle]
        
        # Execute
        load_data_from_folder()
        
        # Assertions
        vehicle_data_arg = mock_data_save_all.call_args[0][0]
        self.assertEqual(len(vehicle_data_arg), 1)
        
        # Verify correct data types in VehicleData objects
        vehicle_data = vehicle_data_arg[0]
        self.assertEqual(vehicle_data.speed, 50)  # int conversion
        self.assertEqual(vehicle_data.odometer, 1000.0)  # float conversion
        self.assertEqual(vehicle_data.soc, 80)  # int conversion from float
        self.assertEqual(vehicle_data.elevation, 200)  # int conversion
        self.assertEqual(vehicle_data.shift_state, 'D')  # string

    @mock.patch('vehicle.service.glob.glob')
    @mock.patch('vehicle.service.pd.read_csv')
    @mock.patch('vehicle.model.VehicleList.save_all')
    @mock.patch('vehicle.model.VehicleData.save_all')
    def test_invalid_timestamp_format(self, mock_data_save_all, mock_list_save_all, mock_read_csv, mock_glob):
        """Test handling of malformed timestamp data."""
        # Setup: CSV with invalid timestamp
        mock_glob.return_value = ['/fake/path/invalid_timestamp.csv']
        mock_df = pd.DataFrame({
            'timestamp': ['invalid-timestamp'],
            'speed': [50],
            'odometer': [1000.5],
            'soc': [80],
            'elevation': [200],
            'shift_state': ['D']
        })
        mock_read_csv.return_value = mock_df
        mock_saved_vehicle = mock.Mock(id=1)
        mock_list_save_all.return_value = [mock_saved_vehicle]
        
        # Execute and expect pandas to handle the invalid timestamp
        # (pd.to_datetime will either parse it or raise an exception)
        with self.assertRaises(Exception):  # Could be ValueError or other pandas exception
            load_data_from_folder()

    @mock.patch('vehicle.service.glob.glob')
    @mock.patch('vehicle.service.pd.read_csv')
    @mock.patch('vehicle.model.VehicleList.save_all')
    @mock.patch('vehicle.model.VehicleData.save_all')
    def test_vehicle_id_extraction(self, mock_data_save_all, mock_list_save_all, mock_read_csv, mock_glob):
        """Test correct vehicle ID extraction from filename."""
        # Setup: Various filename patterns
        mock_glob.return_value = [
            '/path/to/vehicle_123.csv',
            '/another/path/abc-def-456.csv',
            '/simple/test.csv'
        ]
        mock_df = pd.DataFrame({
            'timestamp': ['2025-08-23T12:00:00Z'],
            'speed': [50],
            'odometer': [1000.5],
            'soc': [80],
            'elevation': [200],
            'shift_state': ['D']
        })
        mock_read_csv.return_value = mock_df
        mock_saved_vehicles = [mock.Mock(id=1), mock.Mock(id=2), mock.Mock(id=3)]
        mock_list_save_all.return_value = mock_saved_vehicles
        
        # Execute
        load_data_from_folder()
        
        # Assertions - verify correct vehicle IDs extracted
        vehicle_list_arg = mock_list_save_all.call_args[0][0]
        self.assertEqual(len(vehicle_list_arg), 3)
        
        # Check vehicle IDs (filename without .csv extension)
        self.assertEqual(vehicle_list_arg[0].vehicle_id, 'vehicle_123')
        self.assertEqual(vehicle_list_arg[1].vehicle_id, 'abc-def-456')
        self.assertEqual(vehicle_list_arg[2].vehicle_id, 'test')


if __name__ == '__main__':
    unittest.main()
