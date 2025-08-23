import unittest
from unittest import mock
from fastapi.testclient import TestClient
from fastapi import FastAPI

from vehicle.router import router


class TestGetVehicleIds(unittest.TestCase):
    """Test cases for get_vehicle_ids endpoint with all database calls mocked."""

    def setUp(self):
        """Set up test client for FastAPI testing."""
        self.app = FastAPI()
        self.app.include_router(router)
        self.client = TestClient(self.app)

    @mock.patch('vehicle.router.get_all_vehicle_ids')
    def test_get_vehicle_ids_success_with_data(self, mock_get_all_vehicle_ids):
        """Test successful retrieval when vehicles exist in database."""
        # Setup: Mock vehicle records with different IDs
        mock_vehicle_1 = mock.Mock()
        mock_vehicle_1.vehicle_id = 'vehicle_123'
        mock_vehicle_2 = mock.Mock()
        mock_vehicle_2.vehicle_id = 'abc-def-456'
        mock_vehicle_3 = mock.Mock()
        mock_vehicle_3.vehicle_id = 'test_vehicle'
        
        mock_get_all_vehicle_ids.return_value = [mock_vehicle_1, mock_vehicle_2, mock_vehicle_3]
        
        # Execute
        response = self.client.get("/vehicle_data/vehicle_ids")
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertEqual(len(response.json()), 3)
        self.assertEqual(response.json(), ['vehicle_123', 'abc-def-456', 'test_vehicle'])
        mock_get_all_vehicle_ids.assert_called_once()

    @mock.patch('vehicle.router.get_all_vehicle_ids')
    def test_get_vehicle_ids_empty_database(self, mock_get_all_vehicle_ids):
        """Test behavior when no vehicles exist."""
        # Setup: Mock empty list
        mock_get_all_vehicle_ids.return_value = []
        
        # Execute
        response = self.client.get("/vehicle_data/vehicle_ids")
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), [])
        self.assertIsInstance(response.json(), list)
        mock_get_all_vehicle_ids.assert_called_once()

    @mock.patch('vehicle.router.get_all_vehicle_ids')
    def test_get_vehicle_ids_single_vehicle(self, mock_get_all_vehicle_ids):
        """Test with exactly one vehicle in database."""
        # Setup: Mock single vehicle record
        mock_vehicle = mock.Mock()
        mock_vehicle.vehicle_id = 'single_vehicle_id'
        mock_get_all_vehicle_ids.return_value = [mock_vehicle]
        
        # Execute
        response = self.client.get("/vehicle_data/vehicle_ids")
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0], 'single_vehicle_id')
        mock_get_all_vehicle_ids.assert_called_once()

    @mock.patch('vehicle.router.get_all_vehicle_ids')
    def test_get_vehicle_ids_database_session_injection(self, mock_get_all_vehicle_ids):
        """Verify database session dependency is properly injected."""
        # Setup: Mock vehicle records
        mock_vehicle = mock.Mock()
        mock_vehicle.vehicle_id = 'test_vehicle'
        mock_get_all_vehicle_ids.return_value = [mock_vehicle]
        
        # Execute
        response = self.client.get("/vehicle_data/vehicle_ids")
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        # Verify service function was called (session parameter is injected by FastAPI)
        mock_get_all_vehicle_ids.assert_called_once()
        # Verify the call was made with some session object (we can't easily mock SessionDep)
        call_args = mock_get_all_vehicle_ids.call_args
        self.assertIsNotNone(call_args)
        self.assertEqual(len(call_args[0]), 1)  # Should be called with one argument (session)

    @mock.patch('vehicle.router.get_all_vehicle_ids')
    def test_get_vehicle_ids_response_format(self, mock_get_all_vehicle_ids):
        """Verify response format and content type."""
        # Setup: Mock vehicle records
        mock_vehicle_1 = mock.Mock()
        mock_vehicle_1.vehicle_id = 'format_test_1'
        mock_vehicle_2 = mock.Mock()
        mock_vehicle_2.vehicle_id = 'format_test_2'
        mock_get_all_vehicle_ids.return_value = [mock_vehicle_1, mock_vehicle_2]
        
        # Execute
        response = self.client.get("/vehicle_data/vehicle_ids")
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers["content-type"], "application/json")
        
        # Verify response structure is correct array of strings
        json_response = response.json()
        self.assertIsInstance(json_response, list)
        for item in json_response:
            self.assertIsInstance(item, str)
        
        # Verify content
        self.assertEqual(json_response, ['format_test_1', 'format_test_2'])

    @mock.patch('vehicle.router.get_all_vehicle_ids')
    def test_get_vehicle_ids_special_characters(self, mock_get_all_vehicle_ids):
        """Test vehicle IDs with special characters, UUIDs, etc."""
        # Setup: Mock vehicles with various ID formats
        mock_vehicle_1 = mock.Mock()
        mock_vehicle_1.vehicle_id = '06ab31a9-b35d-4e47-8e44-9c35feb1bfae'  # UUID format
        
        mock_vehicle_2 = mock.Mock()
        mock_vehicle_2.vehicle_id = 'vehicle@test#2023'  # Special characters
        
        mock_vehicle_3 = mock.Mock()
        mock_vehicle_3.vehicle_id = 'véhicule_été_2023'  # Unicode characters
        
        mock_vehicle_4 = mock.Mock()
        mock_vehicle_4.vehicle_id = 'vehicle with spaces'  # Spaces
        
        mock_vehicle_5 = mock.Mock()
        mock_vehicle_5.vehicle_id = '车辆_123'  # Non-Latin characters
        
        mock_get_all_vehicle_ids.return_value = [
            mock_vehicle_1, mock_vehicle_2, mock_vehicle_3, 
            mock_vehicle_4, mock_vehicle_5
        ]
        
        # Execute
        response = self.client.get("/vehicle_data/vehicle_ids")
        
        # Assertions
        self.assertEqual(response.status_code, 200)
        json_response = response.json()
        self.assertIsInstance(json_response, list)
        self.assertEqual(len(json_response), 5)
        
        # Verify all special characters are preserved
        expected_ids = [
            '06ab31a9-b35d-4e47-8e44-9c35feb1bfae',
            'vehicle@test#2023',
            'véhicule_été_2023',
            'vehicle with spaces',
            '车辆_123'
        ]
        self.assertEqual(json_response, expected_ids)
        
        # Verify JSON serialization was successful (no encoding errors)
        for vehicle_id in json_response:
            self.assertIsInstance(vehicle_id, str)
            self.assertGreater(len(vehicle_id), 0)


if __name__ == '__main__':
    unittest.main()
