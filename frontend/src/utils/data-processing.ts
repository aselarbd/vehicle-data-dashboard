import type { VehicleDataPoint, SortableColumn, SortDirection } from '../types';

/**
 * Sort array of vehicle data points by column and direction
 */
export const sortVehicleData = (
  data: VehicleDataPoint[],
  column: SortableColumn,
  direction: SortDirection
): VehicleDataPoint[] => {
  if (!direction || !column) {
    return data;
  }

  return [...data].sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];

    // Handle null values
    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return direction === 'asc' ? 1 : -1;
    if (bVal === null) return direction === 'asc' ? -1 : 1;

    // Handle different data types
    if (column === 'timestamp') {
      aVal = new Date(aVal as string).getTime();
      bVal = new Date(bVal as string).getTime();
    } else if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter vehicle data by search term (searches across all string fields)
 */
export const filterVehicleData = (
  data: VehicleDataPoint[],
  searchTerm: string
): VehicleDataPoint[] => {
  if (!searchTerm.trim()) {
    return data;
  }

  const term = searchTerm.toLowerCase();
  
  return data.filter(row => {
    return Object.values(row).some(value => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Paginate data array
 */
export const paginateData = <T>(
  data: T[],
  page: number,
  itemsPerPage: number
): T[] => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return data.slice(startIndex, endIndex);
};
