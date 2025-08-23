import { useState, useCallback } from 'react';
import type { VehicleDataPoint } from '../types';
import { vehicleApiService } from '../services/api/vehicle.service';
import { PAGINATION, ERROR_MESSAGES } from '../constants';

// Re-export for backward compatibility
export type { VehicleDataPoint } from '../types';

interface UseVehicleDataReturn {
  vehicleData: VehicleDataPoint[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  searchData: (vehicleId: string, startDateTime: string, endDateTime: string, page: number) => Promise<void>;
  clearResults: () => void;
}

export const useVehicleData = (): UseVehicleDataReturn => {
  const [vehicleData, setVehicleData] = useState<VehicleDataPoint[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchData = useCallback(async (
    vehicleId: string, 
    startDateTime: string, 
    endDateTime: string, 
    page: number
  ) => {
    if (!vehicleId) {
      setError(ERROR_MESSAGES.NO_VEHICLE_SELECTED);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const filters = {
        vehicle_id: vehicleId,
        page,
        limit: PAGINATION.ITEMS_PER_PAGE,
        ...(startDateTime && { initial: startDateTime }),
        ...(endDateTime && { final: endDateTime }),
      };

      const response = await vehicleApiService.getVehicleData(filters);
      
      setVehicleData(response.data || []);
      setTotalCount(response.count || 0);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.FAILED_TO_LOAD_DATA;
      setError(errorMessage);
      setVehicleData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setVehicleData([]);
    setTotalCount(0);
    setCurrentPage(1);
    setError(null);
  }, []);

  return {
    vehicleData,
    totalCount,
    currentPage,
    loading,
    error,
    searchData,
    clearResults,
  };
};
