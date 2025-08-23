import unittest
import asyncio
from unittest.mock import Mock, patch
from datetime import datetime
from fastapi import HTTPException, status

from vehicle.router import get_vehicle_data_list
from vehicle.schema import FilterVehicles
from vehicle.model import VehicleList


class TestGetVehicleDataList(unittest.TestCase):
    """Test cases for get_vehicle_data_list endpoint with all database calls mocked."""

    def test_get_vehicle_data_list_success_basic(self):
        """Test successful data retrieval with basic filters"""
        async def async_test():
            # Arrange
            mock_session = Mock()
            filter_vehicles = FilterVehicles(vehicle_id="test-vehicle-123")
            
            # Mock VehicleList found in database
            mock_vehicle_list = VehicleList(id=1, vehicle_id="test-vehicle-123")
            
            # Mock the database query execution
            with patch('vehicle.router.select') as mock_select:
                mock_result = Mock()
                mock_result.first.return_value = mock_vehicle_list
                mock_session.exec.return_value = mock_result
                
                # Mock the service function response
                expected_service_response = {
                    'count': 3,
                    'data': [
                        {'id': 1, 'speed': 50, 'timestamp': '2022-07-12T16:41:05'},
                        {'id': 2, 'speed': 55, 'timestamp': '2022-07-12T16:41:10'},
                        {'id': 3, 'speed': 60, 'timestamp': '2022-07-12T16:41:15'}
                    ]
                }
                
                with patch('vehicle.router.get_vehicle_list', return_value=expected_service_response) as mock_get_vehicle_list:
                    # Act
                    result = await get_vehicle_data_list(filter_vehicles, mock_session)
                    
                    # Assert
                    self.assertEqual(result, expected_service_response)
                    self.assertEqual(result['count'], 3)
                    self.assertEqual(len(result['data']), 3)
                    
                    # Verify service function was called with correct parameters
                    mock_get_vehicle_list.assert_called_once_with(filter_vehicles, 1, mock_session)
                    
                    # Verify database query was executed
                    mock_session.exec.assert_called_once()

        # Run the async test
        asyncio.run(async_test())

    def test_get_vehicle_data_list_vehicle_not_found_404(self):
        """Test 404 when vehicle ID doesn't exist"""
        async def async_test():
            # Arrange
            mock_session = Mock()
            filter_vehicles = FilterVehicles(vehicle_id="non-existent-vehicle")
            
            # Mock VehicleList NOT found in database (returns None)
            with patch('vehicle.router.select') as mock_select:
                mock_result = Mock()
                mock_result.first.return_value = None
                mock_session.exec.return_value = mock_result
                
                # Act & Assert
                with self.assertRaises(HTTPException) as context:
                    await get_vehicle_data_list(filter_vehicles, mock_session)
                
                # Verify the exception details
                self.assertEqual(context.exception.status_code, status.HTTP_404_NOT_FOUND)
                self.assertEqual(context.exception.detail, "Selected Vehicle ID not found")
                
                # Verify database query was executed but service function was not called
                mock_session.exec.assert_called_once()

        # Run the async test
        asyncio.run(async_test())

    def test_get_vehicle_data_list_with_time_filters(self):
        """Test with initial and final datetime filters"""
        async def async_test():
            # Arrange
            mock_session = Mock()
            initial_time = datetime(2022, 7, 12, 16, 0, 0)
            final_time = datetime(2022, 7, 12, 17, 0, 0)
            
            filter_vehicles = FilterVehicles(
                vehicle_id="time-filter-vehicle",
                initial=initial_time,
                final=final_time
            )
            
            # Mock VehicleList found in database
            mock_vehicle_list = VehicleList(id=2, vehicle_id="time-filter-vehicle")
            
            # Mock the database query execution
            with patch('vehicle.router.select') as mock_select:
                mock_result = Mock()
                mock_result.first.return_value = mock_vehicle_list
                mock_session.exec.return_value = mock_result
                
                # Mock the service function response for time-filtered data
                expected_service_response = {
                    'count': 5,
                    'data': [
                        {'id': 10, 'speed': 45, 'timestamp': '2022-07-12T16:30:00'},
                        {'id': 11, 'speed': 50, 'timestamp': '2022-07-12T16:45:00'}
                    ]
                }
                
                with patch('vehicle.router.get_vehicle_list', return_value=expected_service_response) as mock_get_vehicle_list:
                    # Act
                    result = await get_vehicle_data_list(filter_vehicles, mock_session)
                    
                    # Assert
                    self.assertEqual(result, expected_service_response)
                    self.assertEqual(result['count'], 5)
                    
                    # Verify service function was called with correct parameters including time filters
                    mock_get_vehicle_list.assert_called_once_with(filter_vehicles, 2, mock_session)
                    
                    # Verify the filter_vehicles object has the time filters
                    call_args = mock_get_vehicle_list.call_args[0]
                    passed_filter = call_args[0]
                    self.assertEqual(passed_filter.initial, initial_time)
                    self.assertEqual(passed_filter.final, final_time)
                    self.assertEqual(passed_filter.vehicle_id, "time-filter-vehicle")

        # Run the async test
        asyncio.run(async_test())

    def test_get_vehicle_data_list_with_pagination(self):
        """Test pagination parameters (page, limit)"""
        async def async_test():
            # Arrange
            mock_session = Mock()
            filter_vehicles = FilterVehicles(
                vehicle_id="pagination-vehicle",
                page=1,
                limit=10
            )
            
            # Mock VehicleList found in database
            mock_vehicle_list = VehicleList(id=3, vehicle_id="pagination-vehicle")
            
            # Mock the database query execution
            with patch('vehicle.router.select') as mock_select:
                mock_result = Mock()
                mock_result.first.return_value = mock_vehicle_list
                mock_session.exec.return_value = mock_result
                
                # Mock the service function response for paginated data
                expected_service_response = {
                    'count': 100,  # Total count
                    'data': [
                        {'id': i, 'speed': 40 + i, 'timestamp': f'2022-07-12T16:41:{i:02d}'}
                        for i in range(10, 20)  # Page 1, items 10-19
                    ]
                }
                
                with patch('vehicle.router.get_vehicle_list', return_value=expected_service_response) as mock_get_vehicle_list:
                    # Act
                    result = await get_vehicle_data_list(filter_vehicles, mock_session)
                    
                    # Assert
                    self.assertEqual(result, expected_service_response)
                    self.assertEqual(result['count'], 100)  # Total count
                    self.assertEqual(len(result['data']), 10)  # Items in this page
                    
                    # Verify service function was called with correct parameters including pagination
                    mock_get_vehicle_list.assert_called_once_with(filter_vehicles, 3, mock_session)
                    
                    # Verify the filter_vehicles object has the pagination parameters
                    call_args = mock_get_vehicle_list.call_args[0]
                    passed_filter = call_args[0]
                    self.assertEqual(passed_filter.page, 1)
                    self.assertEqual(passed_filter.limit, 10)
                    self.assertEqual(passed_filter.vehicle_id, "pagination-vehicle")

        # Run the async test
        asyncio.run(async_test())

    def test_get_vehicle_data_list_empty_results(self):
        """Test when vehicle exists but no data found"""
        async def async_test():
            # Arrange
            mock_session = Mock()
            filter_vehicles = FilterVehicles(vehicle_id="empty-data-vehicle")
            
            # Mock VehicleList found in database
            mock_vehicle_list = VehicleList(id=4, vehicle_id="empty-data-vehicle")
            
            # Mock the database query execution
            with patch('vehicle.router.select') as mock_select:
                mock_result = Mock()
                mock_result.first.return_value = mock_vehicle_list
                mock_session.exec.return_value = mock_result
                
                # Mock the service function response with empty data
                expected_service_response = {
                    'count': 0,
                    'data': []
                }
                
                with patch('vehicle.router.get_vehicle_list', return_value=expected_service_response) as mock_get_vehicle_list:
                    # Act
                    result = await get_vehicle_data_list(filter_vehicles, mock_session)
                    
                    # Assert
                    self.assertEqual(result, expected_service_response)
                    self.assertEqual(result['count'], 0)
                    self.assertEqual(len(result['data']), 0)
                    self.assertEqual(result['data'], [])
                    
                    # Verify service function was still called even though result is empty
                    mock_get_vehicle_list.assert_called_once_with(filter_vehicles, 4, mock_session)
                    
                    # Verify database query was executed
                    mock_session.exec.assert_called_once()

        # Run the async test
        asyncio.run(async_test())


if __name__ == '__main__':
    unittest.main()
