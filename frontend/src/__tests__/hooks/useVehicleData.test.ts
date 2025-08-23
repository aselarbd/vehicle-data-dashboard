import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { renderHook } from '../__helpers__/test-utils';
import { useVehicleData } from '../../hooks/useVehicleData';
import { mockVehicleData, mockApiError } from '../__helpers__/api-mocks';

// Mock the vehicle API service
vi.mock('../../services/api/vehicle.service', () => ({
  vehicleApiService: {
    getVehicleData: vi.fn(),
  },
}));

// Import the mocked service
import { vehicleApiService } from '../../services/api/vehicle.service';

// Extended mock data for pagination tests
const mockPaginatedResponse = {
  data: mockVehicleData,
  count: 25, // Total count for pagination
};

const mockEmptyResponse = {
  data: [],
  count: 0,
};

describe('useVehicleData', () => {
  const mockGetVehicleData = vehicleApiService.getVehicleData as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useVehicleData());

    expect(result.current.vehicleData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.searchData).toBe('function');
    expect(typeof result.current.clearResults).toBe('function');
  });

  it('should handle successful search data request', async () => {
    mockGetVehicleData.mockResolvedValue(mockPaginatedResponse);

    const { result } = renderHook(() => useVehicleData());

    await act(async () => {
      await result.current.searchData('vehicle-123', '2023-01-01T10:00', '2023-01-01T18:00', 1);
    });

    expect(result.current.vehicleData).toEqual(mockVehicleData);
    expect(result.current.totalCount).toBe(25);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);

    // Verify API was called with correct parameters
    expect(mockGetVehicleData).toHaveBeenCalledWith({
      vehicle_id: 'vehicle-123',
      initial: '2023-01-01T10:00',
      final: '2023-01-01T18:00',
      page: 1,
      limit: 10, // PAGINATION.ITEMS_PER_PAGE
    });
  });

  it('should handle search without date filters', async () => {
    mockGetVehicleData.mockResolvedValue(mockPaginatedResponse);

    const { result } = renderHook(() => useVehicleData());

    await act(async () => {
      await result.current.searchData('vehicle-456', '', '', 2);
    });

    expect(result.current.currentPage).toBe(2);

    // Verify API was called without date parameters
    expect(mockGetVehicleData).toHaveBeenCalledWith({
      vehicle_id: 'vehicle-456',
      page: 2,
      limit: 10,
    });
  });

  it('should reject search when no vehicle ID is provided', async () => {
    const { result } = renderHook(() => useVehicleData());

    await act(async () => {
      await result.current.searchData('', '2023-01-01T10:00', '2023-01-01T18:00', 1);
    });

    expect(result.current.vehicleData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Please select a vehicle');

    // API should not be called
    expect(mockGetVehicleData).not.toHaveBeenCalled();
  });

  it('should show loading state during search', async () => {
    // Create a mock that resolves after delay
    mockGetVehicleData.mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve(mockPaginatedResponse), 100)
      )
    );

    const { result } = renderHook(() => useVehicleData());

    // Verify initial state
    expect(result.current.loading).toBe(false);

    // Start the search and immediately check loading state
    act(() => {
      result.current.searchData('vehicle-789', '', '', 1);
    });

    // Check loading state is now true
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    // Wait for completion
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 150));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.vehicleData).toEqual(mockVehicleData);
  });

  it('should handle API errors during search', async () => {
    mockGetVehicleData.mockRejectedValue(mockApiError);

    const { result } = renderHook(() => useVehicleData());

    // Ensure we have the hook properly initialized
    expect(result.current.searchData).toBeDefined();
    expect(typeof result.current.searchData).toBe('function');

    await act(async () => {
      await result.current.searchData('vehicle-error', '', '', 1);
    });

    expect(result.current.vehicleData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('API Error');
  });

  it('should handle API errors with fallback message', async () => {
    // Mock non-Error object
    mockGetVehicleData.mockRejectedValue({ status: 500, message: 'Server Error' });

    const { result } = renderHook(() => useVehicleData());

    // Ensure hook is properly initialized
    expect(result.current.searchData).toBeDefined();

    await act(async () => {
      await result.current.searchData('vehicle-fallback', '', '', 1);
    });

    expect(result.current.error).toBe('Failed to load vehicle data');
    expect(result.current.vehicleData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
  });

  it('should handle empty data response', async () => {
    mockGetVehicleData.mockResolvedValue(mockEmptyResponse);

    const { result } = renderHook(() => useVehicleData());

    await act(async () => {
      await result.current.searchData('vehicle-empty', '', '', 1);
    });

    expect(result.current.vehicleData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle malformed API response', async () => {
    // Mock response without required fields
    mockGetVehicleData.mockResolvedValue({ data: null, count: null });

    const { result } = renderHook(() => useVehicleData());

    await act(async () => {
      await result.current.searchData('vehicle-malformed', '', '', 1);
    });

    expect(result.current.vehicleData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should clear results correctly', async () => {
    // First, load some data
    mockGetVehicleData.mockResolvedValue(mockPaginatedResponse);

    const { result } = renderHook(() => useVehicleData());

    await act(async () => {
      await result.current.searchData('vehicle-clear', '', '', 3);
    });

    // Verify data is loaded
    expect(result.current.vehicleData).toEqual(mockVehicleData);
    expect(result.current.totalCount).toBe(25);
    expect(result.current.currentPage).toBe(3);

    // Clear results
    act(() => {
      result.current.clearResults();
    });

    // Verify everything is cleared
    expect(result.current.vehicleData).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.error).toBe(null);
  });

  it('should handle pagination correctly', async () => {
    mockGetVehicleData.mockResolvedValue(mockPaginatedResponse);

    const { result } = renderHook(() => useVehicleData());

    // Search page 1
    await act(async () => {
      await result.current.searchData('vehicle-pagination', '2023-01-01T10:00', '2023-01-01T18:00', 1);
    });

    expect(result.current.currentPage).toBe(1);

    // Search page 3
    await act(async () => {
      await result.current.searchData('vehicle-pagination', '2023-01-01T10:00', '2023-01-01T18:00', 3);
    });

    expect(result.current.currentPage).toBe(3);

    // Verify both API calls were made with correct page numbers
    expect(mockGetVehicleData).toHaveBeenCalledTimes(2);
    expect(mockGetVehicleData).toHaveBeenNthCalledWith(1, expect.objectContaining({ page: 1 }));
    expect(mockGetVehicleData).toHaveBeenNthCalledWith(2, expect.objectContaining({ page: 3 }));
  });

  it('should maintain function reference stability', () => {
    const { result, rerender } = renderHook(() => useVehicleData());

    const initialFunctions = {
      searchData: result.current.searchData,
      clearResults: result.current.clearResults,
    };

    rerender();

    // Functions should maintain reference stability (useCallback)
    expect(result.current.searchData).toBe(initialFunctions.searchData);
    expect(result.current.clearResults).toBe(initialFunctions.clearResults);
  });

  it('should handle concurrent search requests correctly', async () => {
    // Setup different responses
    mockGetVehicleData
      .mockResolvedValueOnce({ data: [mockVehicleData[0]], count: 1 })
      .mockResolvedValueOnce({ data: [mockVehicleData[1]], count: 1 });

    const { result } = renderHook(() => useVehicleData());

    // Start two concurrent searches
    const search1 = act(async () => {
      await result.current.searchData('vehicle-1', '', '', 1);
    });

    const search2 = act(async () => {
      await result.current.searchData('vehicle-2', '', '', 1);
    });

    await Promise.all([search1, search2]);

    // Should show results from the last completed search
    expect(result.current.vehicleData).toEqual([mockVehicleData[1]]);
    expect(result.current.totalCount).toBe(1);
    expect(mockGetVehicleData).toHaveBeenCalledTimes(2);
  });
});
