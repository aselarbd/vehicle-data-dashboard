// Legacy API file - now delegates to the new API service
// This file is kept for backward compatibility during migration

import type { VehicleDataResponse, ExportFormat } from '../types';
import { vehicleApiService } from './api/vehicle.service';

// Maintain backward compatibility with the old API interface
export const vehicleApi = {
  // Get all vehicle IDs
  async getVehicleIds(): Promise<string[]> {
    return vehicleApiService.getVehicleIds();
  },

  // Get vehicle data with filters
  async getVehicleData(params: {
    vehicle_id: string;
    initial?: string;
    final?: string;
    page?: number;
    limit?: number;
  }): Promise<VehicleDataResponse> {
    return vehicleApiService.getVehicleData(params);
  },

  // Populate database with sample vehicle data
  async populateData(): Promise<void> {
    return vehicleApiService.populateData();
  },

  // Export vehicle data as file
  async exportData(vehicleId: string, exportType: ExportFormat): Promise<Blob> {
    return vehicleApiService.exportData(vehicleId, exportType);
  },
};