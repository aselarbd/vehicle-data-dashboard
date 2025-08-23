// Type-safe constants (instead of enums due to TS config)
export const EXPORT_FORMAT = {
  JSON: 'JSON',
  CSV: 'CSV',
  EXCEL: 'EXCEL',
} as const;

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const LOADING_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Core vehicle data types
export interface VehicleDataPoint {
  id: number;
  timestamp: string;
  speed: number | null;
  odometer: number;
  soc: number;
  elevation: number;
  shift_state: string | null;
}

// API response types
export interface VehicleDataResponse {
  data: VehicleDataPoint[];
  count: number;
}

// Export types
export type ExportFormat = typeof EXPORT_FORMAT[keyof typeof EXPORT_FORMAT];

// Sort types
export type SortDirection = typeof SORT_DIRECTION[keyof typeof SORT_DIRECTION] | null;
export type SortableColumn = 'id' | 'timestamp' | 'speed' | 'odometer' | 'soc' | 'elevation' | 'shift_state';

// Loading status type
export type LoadingStatus = typeof LOADING_STATUS[keyof typeof LOADING_STATUS];

// Filter types
export interface VehicleDataFilters {
  vehicle_id: string;
  initial?: string;
  final?: string;
  page?: number;
  limit?: number;
}

// Pagination types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
}
