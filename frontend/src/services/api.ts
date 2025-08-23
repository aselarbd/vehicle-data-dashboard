import axios from 'axios';

// Base configuration for API calls
const API_BASE_URL = 'http://localhost:8000/api/v1/vehicle_data';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Types for our API responses
export interface VehicleData {
  id: number;
  timestamp: string;
  speed: number | null;
  odometer: number;
  soc: number;
  elevation: number;
  shift_state: string | null;
}

export interface VehicleDataResponse {
  data: VehicleData[];
  count: number;
}

// API service functions
export const vehicleApi = {
  // Get all vehicle IDs
  async getVehicleIds(): Promise<string[]> {
    try {
      const response = await api.get('/vehicle_ids');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vehicle IDs:', error);
      throw new Error('Failed to load vehicle IDs');
    }
  },

  // Get vehicle data with filters
  async getVehicleData(params: {
    vehicle_id: string;
    initial?: string;
    final?: string;
    page?: number;
    limit?: number;
  }): Promise<VehicleDataResponse> {
    try {
      // Convert page to 0-based indexing for backend
      const backendParams = {
        ...params,
        page: params.page ? params.page - 1 : 0
      };
      
      const response = await api.get('/', { params: backendParams });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vehicle data:', error);
      throw new Error('Failed to load vehicle data');
    }
  },

  // Populate database with sample vehicle data
  async populateData(): Promise<void> {
    try {
      const response = await api.post('/populate', {});
      return response.data;
    } catch (error) {
      console.error('Failed to populate data:', error);
      throw new Error('Failed to populate database with sample data');
    }
  },

  // Export vehicle data as file
  async exportData(vehicleId: string, exportType: 'JSON' | 'CSV' | 'EXCEL'): Promise<Blob> {
    try {
      const response = await api.get('/export', {
        params: {
          vehicle_id: vehicleId,
          export_type: exportType
        },
        responseType: 'blob' // Important: tells axios to handle binary data
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Failed to export vehicle data');
    }
  },
};