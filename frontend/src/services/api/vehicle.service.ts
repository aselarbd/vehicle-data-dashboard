import type { VehicleDataResponse, VehicleDataFilters, ExportFormat } from '../../types';
import { API_CONFIG, ERROR_MESSAGES } from '../../constants';
import { ApiClient } from './client';

class VehicleApiService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient();
  }

  /**
   * Get all vehicle IDs from the backend
   */
  async getVehicleIds(): Promise<string[]> {
    try {
      const data = await this.client.get<string[]>(API_CONFIG.ENDPOINTS.VEHICLE_IDS);
      return data;
    } catch (error) {
      console.error('Failed to fetch vehicle IDs:', error);
      throw new Error(ERROR_MESSAGES.FAILED_TO_LOAD_VEHICLES);
    }
  }

  /**
   * Get vehicle data with filtering and pagination
   */
  async getVehicleData(filters: VehicleDataFilters): Promise<VehicleDataResponse> {
    try {
      // Convert page to 0-based indexing for backend
      const backendParams = {
        ...filters,
        page: filters.page ? filters.page - 1 : 0,
      };
      
      const data = await this.client.get<VehicleDataResponse>(
        API_CONFIG.ENDPOINTS.VEHICLE_DATA, 
        { params: backendParams }
      );
      return data;
    } catch (error) {
      console.error('Failed to fetch vehicle data:', error);
      throw new Error(ERROR_MESSAGES.FAILED_TO_LOAD_DATA);
    }
  }

  /**
   * Populate database with sample vehicle data
   */
  async populateData(): Promise<void> {
    try {
      await this.client.post<void>(API_CONFIG.ENDPOINTS.POPULATE);
    } catch (error) {
      console.error('Failed to populate data:', error);
      throw new Error(ERROR_MESSAGES.FAILED_TO_POPULATE);
    }
  }

  /**
   * Export vehicle data to file
   */
  async exportData(vehicleId: string, exportType: ExportFormat): Promise<Blob> {
    try {
      const blob = await this.client.downloadFile(API_CONFIG.ENDPOINTS.EXPORT, {
        vehicle_id: vehicleId,
        export_type: exportType,
      });
      return blob;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error(ERROR_MESSAGES.FAILED_TO_EXPORT);
    }
  }
}

// Create singleton instance
export const vehicleApiService = new VehicleApiService();

// Export individual methods for easier use
export const {
  getVehicleIds,
  getVehicleData,
  populateData,
  exportData,
} = vehicleApiService;
