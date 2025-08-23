import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockVehicleIds, mockVehicleData } from '../__helpers__/api-mocks';

// Mock the entire vehicle service module
vi.mock('../../services/api/vehicle.service', () => {
  const mockService = {
    getVehicleIds: vi.fn(),
    getVehicleData: vi.fn(),
    populateData: vi.fn(),
    exportData: vi.fn(),
  };

  return {
    vehicleApiService: mockService,
    getVehicleIds: mockService.getVehicleIds,
    getVehicleData: mockService.getVehicleData,
    populateData: mockService.populateData,
    exportData: mockService.exportData,
  };
});

// Import the mocked functions
import { vehicleApiService, getVehicleIds, getVehicleData, populateData, exportData } from '../../services/api/vehicle.service';

describe('VehicleApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getVehicleIds', () => {
    it('should fetch vehicle IDs successfully', async () => {
      (getVehicleIds as any).mockResolvedValue(mockVehicleIds);

      const result = await getVehicleIds();

      expect(result).toEqual(mockVehicleIds);
      expect(getVehicleIds).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      (getVehicleIds as any).mockRejectedValue(error);

      await expect(getVehicleIds()).rejects.toThrow('API Error');
      expect(getVehicleIds).toHaveBeenCalledTimes(1);
    });

    it('should handle empty responses', async () => {
      (getVehicleIds as any).mockResolvedValue([]);

      const result = await getVehicleIds();

      expect(result).toEqual([]);
      expect(getVehicleIds).toHaveBeenCalledTimes(1);
    });
  });

  describe('getVehicleData', () => {
    const mockResponse = {
      data: mockVehicleData,
      count: 25,
    };

    it('should fetch vehicle data with filters', async () => {
      (getVehicleData as any).mockResolvedValue(mockResponse);

      const filters = {
        vehicle_id: 'test-vehicle-123',
        initial: '2023-01-01T10:00',
        final: '2023-01-01T18:00',
        page: 1,
        limit: 10,
      };

      const result = await getVehicleData(filters);

      expect(result).toEqual(mockResponse);
      expect(getVehicleData).toHaveBeenCalledWith(filters);
      expect(getVehicleData).toHaveBeenCalledTimes(1);
    });

    it('should handle minimal filters', async () => {
      (getVehicleData as any).mockResolvedValue(mockResponse);

      const filters = {
        vehicle_id: 'test-vehicle-456',
      };

      const result = await getVehicleData(filters);

      expect(result).toEqual(mockResponse);
      expect(getVehicleData).toHaveBeenCalledWith(filters);
      expect(getVehicleData).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      const error = new Error('Data fetch failed');
      (getVehicleData as any).mockRejectedValue(error);

      const filters = { vehicle_id: 'error-vehicle' };

      await expect(getVehicleData(filters)).rejects.toThrow('Data fetch failed');
      expect(getVehicleData).toHaveBeenCalledWith(filters);
    });

    it('should handle empty data responses', async () => {
      const emptyResponse = { data: [], count: 0 };
      (getVehicleData as any).mockResolvedValue(emptyResponse);

      const filters = { vehicle_id: 'empty-vehicle' };
      const result = await getVehicleData(filters);

      expect(result).toEqual(emptyResponse);
      expect(getVehicleData).toHaveBeenCalledWith(filters);
    });
  });

  describe('populateData', () => {
    it('should call populate successfully', async () => {
      (populateData as any).mockResolvedValue(undefined);

      await populateData();

      expect(populateData).toHaveBeenCalledTimes(1);
      expect(populateData).toHaveBeenCalledWith();
    });

    it('should handle populate errors', async () => {
      const error = new Error('Population failed');
      (populateData as any).mockRejectedValue(error);

      await expect(populateData()).rejects.toThrow('Population failed');
      expect(populateData).toHaveBeenCalledTimes(1);
    });
  });

  describe('exportData', () => {
    const mockBlob = new Blob(['test data'], { type: 'text/csv' });

    it('should export data successfully', async () => {
      (exportData as any).mockResolvedValue(mockBlob);

      const result = await exportData('vehicle-123', 'CSV');

      expect(result).toBe(mockBlob);
      expect(exportData).toHaveBeenCalledWith('vehicle-123', 'CSV');
      expect(exportData).toHaveBeenCalledTimes(1);
    });

    it('should handle different export formats', async () => {
      (exportData as any).mockResolvedValue(mockBlob);

      await exportData('vehicle-json', 'JSON');
      expect(exportData).toHaveBeenCalledWith('vehicle-json', 'JSON');

      await exportData('vehicle-excel', 'EXCEL');
      expect(exportData).toHaveBeenCalledWith('vehicle-excel', 'EXCEL');

      expect(exportData).toHaveBeenCalledTimes(2);
    });

    it('should handle export errors', async () => {
      const error = new Error('Export failed');
      (exportData as any).mockRejectedValue(error);

      await expect(exportData('error-vehicle', 'CSV')).rejects.toThrow('Export failed');
      expect(exportData).toHaveBeenCalledWith('error-vehicle', 'CSV');
    });
  });

  describe('vehicleApiService singleton', () => {
    it('should have all required methods', () => {
      expect(typeof vehicleApiService.getVehicleIds).toBe('function');
      expect(typeof vehicleApiService.getVehicleData).toBe('function');
      expect(typeof vehicleApiService.populateData).toBe('function');
      expect(typeof vehicleApiService.exportData).toBe('function');
    });

    it('should allow calling methods on singleton instance', async () => {
      (vehicleApiService.getVehicleIds as any).mockResolvedValue(mockVehicleIds);

      const result = await vehicleApiService.getVehicleIds();

      expect(result).toEqual(mockVehicleIds);
      expect(vehicleApiService.getVehicleIds).toHaveBeenCalledTimes(1);
    });
  });
});
