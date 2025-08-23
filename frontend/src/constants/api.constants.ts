// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api/v1/vehicle_data',
  TIMEOUT: 10000,
  ENDPOINTS: {
    VEHICLE_IDS: '/vehicle_ids',
    VEHICLE_DATA: '/',
    POPULATE: '/populate',
    EXPORT: '/export',
  },
} as const;

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_VISIBLE_PAGES: 5,
} as const;

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MAX_TABLE_HEIGHT: 600,
} as const;

// File Export
export const EXPORT = {
  FORMATS: ['JSON', 'CSV', 'EXCEL'] as const,
  FILE_EXTENSIONS: {
    JSON: 'json',
    CSV: 'csv',
    EXCEL: 'xlsx',
  } as const,
} as const;
