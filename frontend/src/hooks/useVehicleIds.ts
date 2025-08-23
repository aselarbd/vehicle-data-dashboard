import { useState, useEffect } from 'react';
import { vehicleApiService } from '../services/api/vehicle.service';
import { ERROR_MESSAGES } from '../constants';

interface UseVehicleIdsReturn {
  vehicleIds: string[];
  loading: boolean;
  error: string | null;
}

export const useVehicleIds = (): UseVehicleIdsReturn => {
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleIds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const ids = await vehicleApiService.getVehicleIds();
        setVehicleIds(ids);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.FAILED_TO_LOAD_VEHICLES;
        setError(errorMessage);
        console.error('Error loading vehicle IDs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleIds();
  }, []);

  return {
    vehicleIds,
    loading,
    error,
  };
};