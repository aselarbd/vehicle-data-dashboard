import { useState } from 'react';
import { vehicleApi } from '../services/api';
import type { VehicleData } from '../services/api';

interface UseVehicleDataReturn {
  vehicleData: VehicleData[];
  totalCount: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  searchData: (vehicleId: string, startDateTime?: string, endDateTime?: string, page?: number) => Promise<void>;
  clearResults: () => void;
}

export const useVehicleData = (): UseVehicleDataReturn => {
  const [vehicleData, setVehicleData] = useState<VehicleData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchData = async (
    vehicleId: string, 
    startDateTime?: string, 
    endDateTime?: string, 
    page: number = 1
  ) => {
    if (!vehicleId.trim()) {
      setError('Please select a vehicle ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        vehicle_id: vehicleId,
        limit: 10,
        page: page,
      };

      if (startDateTime) {
        params.initial = startDateTime;
      }
      if (endDateTime) {
        params.final = endDateTime;
      }

      const response = await vehicleApi.getVehicleData(params);
      setVehicleData(response.data);
      setTotalCount(response.count);
      setCurrentPage(page);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch vehicle data';
      setError(errorMessage);
      setVehicleData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setVehicleData([]);
    setTotalCount(0);
    setCurrentPage(1);
    setError(null);
  };

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