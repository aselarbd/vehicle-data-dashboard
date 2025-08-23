import { EXPORT } from '../constants';

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return timestamp;
  }
};

/**
 * Format numeric values with proper localization and handling of null values
 */
export const formatNumericValue = (value: number | null, decimals = 0): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format any value for table display
 */
export const formatTableValue = (value: any): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  if (typeof value === 'number') {
    return formatNumericValue(value);
  }
  
  if (typeof value === 'string' && value.includes('T')) {
    // Looks like an ISO timestamp
    return formatTimestamp(value);
  }
  
  return String(value);
};

/**
 * Generate filename for export based on vehicle ID and export format
 */
export const generateExportFilename = (vehicleId: string, format: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const extension = EXPORT.FILE_EXTENSIONS[format as keyof typeof EXPORT.FILE_EXTENSIONS] || 'txt';
  return `vehicle_data_${vehicleId}_${timestamp}.${extension}`;
};

/**
 * Download blob as file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Validate date range for forms
 */
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true; // Empty dates are valid
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start < end;
};

/**
 * Calculate pagination info
 */
export const calculatePaginationInfo = (currentPage: number, totalCount: number, itemsPerPage: number) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);
  
  return {
    totalPages,
    startItem,
    endItem,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
