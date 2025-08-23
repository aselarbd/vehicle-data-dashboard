import unittest
import asyncio
from unittest.mock import Mock, patch
from datetime import datetime
from fastapi import HTTPException, status

from vehicle.router import get_a_vehicle_data
from vehicle.model import VehicleData


class TestGetAVehicleData(unittest.TestCase):
    """Test cases for the get_a_vehicle_data endpoint"""

    def test_get_vehicle_data_success(self):
        """Test successful retrieval of vehicle data"""
        async def async_test():
            # Arrange
            mock_session = Mock()
            vehicle_id = 1
            expected_vehicle_data = VehicleData(
                id=1,
                timestamp=datetime(2024, 1, 1, 12, 0, 0),
                speed=60,
                odometer=15000.5,
                soc=80,
                elevation=100,
                shift_state="D",
                vehicle_list_id=1
            )
            
            # Mock the get_a_vehicle service function (correct function name)
            with patch('vehicle.router.get_a_vehicle', return_value=expected_vehicle_data) as mock_get_a_vehicle:
                # Act
                result = await get_a_vehicle_data(vehicle_id, mock_session)
                
                # Assert
                self.assertEqual(result, expected_vehicle_data)
                mock_get_a_vehicle.assert_called_once_with(vehicle_id, mock_session)

        # Run the async test
        asyncio.run(async_test())

    def test_get_vehicle_data_not_found(self):
        """Test 404 case when vehicle data is not found"""
        async def async_test():
            # Arrange
            mock_session = Mock()
            vehicle_id = 999
            
            # Mock the get_a_vehicle service function to return None (correct function name)
            with patch('vehicle.router.get_a_vehicle', return_value=None) as mock_get_a_vehicle:
                # Act & Assert
                with self.assertRaises(HTTPException) as context:
                    await get_a_vehicle_data(vehicle_id, mock_session)
                
                # Verify the exception details
                self.assertEqual(context.exception.status_code, status.HTTP_404_NOT_FOUND)
                self.assertEqual(context.exception.detail, "Vehicle record not found")
                mock_get_a_vehicle.assert_called_once_with(vehicle_id, mock_session)

        # Run the async test
        asyncio.run(async_test())

    def test_get_vehicle_data_invalid_id_types(self):
        """Test with invalid vehicle ID types (negative numbers, zero)"""
        async def async_test():
            mock_session = Mock()
            
            # Test cases for invalid IDs
            invalid_ids = [
                -1,    # negative number
                -999,  # large negative number
                0,     # zero
            ]
            
            for invalid_id in invalid_ids:
                with self.subTest(vehicle_id=invalid_id):
                    # Mock the get_a_vehicle service function to return None for invalid IDs (correct function name)
                    with patch('vehicle.router.get_a_vehicle', return_value=None) as mock_get_a_vehicle:
                        # Act & Assert
                        with self.assertRaises(HTTPException) as context:
                            await get_a_vehicle_data(invalid_id, mock_session)
                        
                        # Verify the exception details
                        self.assertEqual(context.exception.status_code, status.HTTP_404_NOT_FOUND)
                        self.assertEqual(context.exception.detail, "Vehicle record not found")
                        mock_get_a_vehicle.assert_called_with(invalid_id, mock_session)

        # Run the async test
        asyncio.run(async_test())

    def test_get_vehicle_data_response_schema(self):
        """Test response matches VehicleDataSchema structure"""
        async def async_test():
            # Arrange
            mock_session = Mock()
            vehicle_id = 42
            expected_vehicle_data = VehicleData(
                id=42,
                timestamp=datetime(2025, 8, 23, 14, 30, 0),
                speed=65,
                odometer=5000.75,
                soc=95,
                elevation=350,
                shift_state="R",
                vehicle_list_id=5
            )
            
            # Mock the get_a_vehicle service function
            with patch('vehicle.router.get_a_vehicle', return_value=expected_vehicle_data) as mock_get_a_vehicle:
                # Act
                result = await get_a_vehicle_data(vehicle_id, mock_session)
                
                # Assert
                self.assertEqual(result, expected_vehicle_data)
                
                # Verify all expected fields are present
                self.assertEqual(result.id, 42)
                self.assertEqual(result.timestamp, datetime(2025, 8, 23, 14, 30, 0))
                self.assertEqual(result.speed, 65)
                self.assertEqual(result.odometer, 5000.75)
                self.assertEqual(result.soc, 95)
                self.assertEqual(result.elevation, 350)
                self.assertEqual(result.shift_state, "R")
                self.assertEqual(result.vehicle_list_id, 5)
                
                mock_get_a_vehicle.assert_called_once_with(vehicle_id, mock_session)

        # Run the async test
        asyncio.run(async_test())


if __name__ == '__main__':
    unittest.main()
