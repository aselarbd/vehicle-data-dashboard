import type { VehicleDataPoint, ExportFormat, SortDirection } from '../types';
import { EXPORT_FORMAT, SORT_DIRECTION, VALIDATION } from '../constants';

// Type guards
export const isValidExportFormat = (format: string): format is ExportFormat => {
  return Object.values(EXPORT_FORMAT).includes(format as ExportFormat);
};

export const isValidSortDirection = (direction: string | null): direction is SortDirection => {
  return Object.values(SORT_DIRECTION).includes(direction as any) || direction === null;
};

export const isVehicleDataPoint = (obj: any): obj is VehicleDataPoint => {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'number' &&
    typeof obj.timestamp === 'string' &&
    (obj.speed === null || typeof obj.speed === 'number') &&
    typeof obj.odometer === 'number' &&
    typeof obj.soc === 'number' &&
    typeof obj.elevation === 'number' &&
    (obj.shift_state === null || typeof obj.shift_state === 'string')
  );
};

// Validation functions
export const isValidVehicleId = (id: string): boolean => {
  return VALIDATION.VEHICLE_ID_PATTERN.test(id);
};

export const isValidDateTime = (dateTime: string): boolean => {
  if (!dateTime) return true; // Optional fields are valid when empty
  return VALIDATION.DATETIME_PATTERN.test(dateTime);
};

export const isValidDateRange = (start: string, end: string): boolean => {
  if (!start || !end) return true; // If either is empty, it's valid
  return new Date(start) < new Date(end);
};
