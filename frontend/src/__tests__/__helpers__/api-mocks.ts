import { vi } from 'vitest';

// Mock API responses
export const mockVehicleIds = [
  '06ab31a9-b35d-4e47-8e44-9c35feb1bfae',
  '1bbdf62b-4e52-48c4-8703-5a844d1da912',
  'f212b271-f033-444c-a445-560511f95e9c',
];

export const mockVehicleData = [
  {
    id: 1,
    timestamp: '2023-01-01T10:00:00Z',
    speed: 25.5,
    odometer: 12345,
    soc: 85,
    elevation: 150,
    shift_state: 'D',
  },
  {
    id: 2,
    timestamp: '2023-01-01T10:01:00Z',
    speed: 30.2,
    odometer: 12346,
    soc: 84,
    elevation: 155,
    shift_state: 'D',
  },
];

// Mock API service functions
export const createMockVehicleApiService = () => ({
  getVehicleIds: vi.fn(),
  getVehicleData: vi.fn(),
  populateData: vi.fn(),
  exportData: vi.fn(),
});

// Mock error responses
export const mockApiError = new Error('API Error');
export const mockNetworkError = new Error('Network Error');

// Helper to simulate async delay
export const createAsyncMock = <T>(data: T, delay = 100) => 
  vi.fn().mockImplementation(() => 
    new Promise((resolve) => setTimeout(() => resolve(data), delay))
  );

export const createAsyncErrorMock = (error: Error, delay = 100) =>
  vi.fn().mockImplementation(() => 
    new Promise((_, reject) => setTimeout(() => reject(error), delay))
  );
