import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from '../__helpers__/test-utils';
import { useVehicleIds } from '../../hooks/useVehicleIds';
import { mockVehicleIds, mockApiError, createAsyncMock } from '../__helpers__/api-mocks';

// Mock the vehicle API service
vi.mock('../../services/api/vehicle.service', () => ({
  vehicleApiService: {
    getVehicleIds: vi.fn(),
  },
}));

// Import the mocked service
import { vehicleApiService } from '../../services/api/vehicle.service';

describe('useVehicleIds', () => {
  const mockGetVehicleIds = vehicleApiService.getVehicleIds as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with loading state', () => {
    // Setup: API call that never resolves to test initial state
    mockGetVehicleIds.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useVehicleIds());

    expect(result.current.vehicleIds).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should fetch vehicle IDs successfully', async () => {
    // Setup: Mock successful API response
    mockGetVehicleIds.mockResolvedValue(mockVehicleIds);

    const { result } = renderHook(() => useVehicleIds());

    // Initial state should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.vehicleIds).toEqual([]);
    expect(result.current.error).toBe(null);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Final state should have the data
    expect(result.current.vehicleIds).toEqual(mockVehicleIds);
    expect(result.current.error).toBe(null);
    expect(mockGetVehicleIds).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors correctly', async () => {
    // Setup: Mock API error
    mockGetVehicleIds.mockRejectedValue(mockApiError);

    const { result } = renderHook(() => useVehicleIds());

    // Initial state should be loading
    expect(result.current.loading).toBe(true);

    // Wait for the error to be handled
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Final state should have the error
    expect(result.current.vehicleIds).toEqual([]);
    expect(result.current.error).toBe('API Error');
    expect(mockGetVehicleIds).toHaveBeenCalledTimes(1);
  });

  it('should handle network errors with fallback message', async () => {
    // Setup: Mock non-Error object (not an instance of Error)
    const networkError = { code: 'NETWORK_ERROR', status: 0 };
    mockGetVehicleIds.mockRejectedValue(networkError);

    const { result } = renderHook(() => useVehicleIds());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should use fallback error message from constants since it's not an Error instance
    expect(result.current.error).toBe('Failed to load vehicle IDs');
    expect(result.current.vehicleIds).toEqual([]);
  });

  it('should handle Error objects with empty messages', async () => {
    // Setup: Mock Error with empty message
    const emptyMessageError = new Error('');
    mockGetVehicleIds.mockRejectedValue(emptyMessageError);

    const { result } = renderHook(() => useVehicleIds());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should use the empty message since it's still an Error instance
    expect(result.current.error).toBe('');
    expect(result.current.vehicleIds).toEqual([]);
  });

  it('should handle empty vehicle IDs response', async () => {
    // Setup: Mock empty array response
    mockGetVehicleIds.mockResolvedValue([]);

    const { result } = renderHook(() => useVehicleIds());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vehicleIds).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(mockGetVehicleIds).toHaveBeenCalledTimes(1);
  });

  it('should only call API once per hook instance', async () => {
    // Setup: Mock successful response with delay
    mockGetVehicleIds.mockImplementation(createAsyncMock(mockVehicleIds, 50));

    const { result, rerender } = renderHook(() => useVehicleIds());

    // Trigger multiple re-renders
    rerender();
    rerender();
    rerender();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // API should only be called once despite multiple re-renders
    expect(mockGetVehicleIds).toHaveBeenCalledTimes(1);
    expect(result.current.vehicleIds).toEqual(mockVehicleIds);
  });

  it('should handle different error types correctly', async () => {
    const testCases = [
      {
        error: new Error('Custom API Error'),
        expectedMessage: 'Custom API Error',
      },
      {
        error: 'String error',
        expectedMessage: 'Failed to load vehicle IDs',
      },
      {
        error: { message: 'Object error' },
        expectedMessage: 'Failed to load vehicle IDs',
      },
    ];

    for (const { error, expectedMessage } of testCases) {
      mockGetVehicleIds.mockRejectedValue(error);

      const { result } = renderHook(() => useVehicleIds());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(expectedMessage);
      
      // Clear mock for next iteration
      vi.clearAllMocks();
    }
  });

  it('should handle concurrent hook instances independently', async () => {
    // Setup: Different responses for different calls
    mockGetVehicleIds
      .mockResolvedValueOnce(['vehicle-1', 'vehicle-2'])
      .mockResolvedValueOnce(['vehicle-3', 'vehicle-4']);

    // Render two hook instances
    const { result: result1 } = renderHook(() => useVehicleIds());
    const { result: result2 } = renderHook(() => useVehicleIds());

    // Both should start loading
    expect(result1.current.loading).toBe(true);
    expect(result2.current.loading).toBe(true);

    // Wait for both to finish
    await waitFor(() => {
      expect(result1.current.loading).toBe(false);
      expect(result2.current.loading).toBe(false);
    });

    // Each should have their respective data
    expect(result1.current.vehicleIds).toEqual(['vehicle-1', 'vehicle-2']);
    expect(result2.current.vehicleIds).toEqual(['vehicle-3', 'vehicle-4']);
    expect(mockGetVehicleIds).toHaveBeenCalledTimes(2);
  });

  it('should handle console.error calls on error', async () => {
    // Mock console.error to verify it's called
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    mockGetVehicleIds.mockRejectedValue(mockApiError);

    renderHook(() => useVehicleIds());

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading vehicle IDs:', mockApiError);
    });

    consoleSpy.mockRestore();
  });
});
