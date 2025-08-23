// Re-export all API services and utilities
export * from './client';
export * from './error-handler';
export * from './vehicle.service';

// Export default service instance for convenience
export { vehicleApiService as default } from './vehicle.service';
