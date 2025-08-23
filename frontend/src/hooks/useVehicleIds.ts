import { useState, useEffect } from 'react';

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
        
        const response = await fetch('http://localhost:8000/api/v1/vehicle_data/vehicle_ids');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const ids = await response.json();
        setVehicleIds(ids);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicle IDs';
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