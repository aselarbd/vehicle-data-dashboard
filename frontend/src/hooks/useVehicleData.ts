import { useState, useCallback } from 'react';
import type { VehicleDataPoint } from '../types';
import { PAGINATION } from '../constants';

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
      setError('Please select a vehicle');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const page_zero_based = page - 1; // Backend expects 0-based pagination
      const params = new URLSearchParams({
        vehicle_id: vehicleId,
        page: page_zero_based.toString(),
        limit: PAGINATION.ITEMS_PER_PAGE.toString(),
      });

      if (startDateTime) {
        params.append('initial', startDateTime);
      }
      if (endDateTime) {
        params.append('final', endDateTime);
      }

      const response = await fetch(`http://localhost:8000/api/v1/vehicle_data/?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setVehicleData(data.data || []);
      setTotalCount(data.count || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vehicle data');
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
