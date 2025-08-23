import axios from 'axios';
import type { VehicleDataResponse, ExportFormat } from '../types';
import { API_CONFIG } from '../constants';

// Base configuration for API calls
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// API service functions
export const vehicleApi = {
  // Get all vehicle IDs
  async getVehicleIds(): Promise<string[]> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.VEHICLE_IDS);
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
      
      const response = await api.get(API_CONFIG.ENDPOINTS.VEHICLE_DATA, { params: backendParams });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch vehicle data:', error);
      throw new Error('Failed to load vehicle data');
    }
  },

  // Populate database with sample vehicle data
  async populateData(): Promise<void> {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.POPULATE, {});
      return response.data;
    } catch (error) {
      console.error('Failed to populate data:', error);
      throw new Error('Failed to populate database with sample data');
    }
  },

  // Export vehicle data as file
  async exportData(vehicleId: string, exportType: ExportFormat): Promise<Blob> {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.EXPORT, {
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