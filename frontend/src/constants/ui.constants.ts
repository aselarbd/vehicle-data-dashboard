// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An unexpected error occurred',
  NETWORK: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  NO_VEHICLE_SELECTED: 'Please select a vehicle',
  INVALID_DATE_RANGE: 'End date must be after start date',
  FAILED_TO_LOAD_VEHICLES: 'Failed to load vehicle IDs',
  FAILED_TO_LOAD_DATA: 'Failed to load vehicle data',
  FAILED_TO_POPULATE: 'Failed to populate database with sample data',
  FAILED_TO_EXPORT: 'Failed to export vehicle data',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  DATA_POPULATED: 'Database populated successfully',
  DATA_EXPORTED: 'Data exported successfully',
  FILTERS_CLEARED: 'Filters cleared',
} as const;

// UI Labels
export const UI_LABELS = {
  LOADING: {
    DEFAULT: 'Loading...',
    VEHICLES: 'Loading vehicles...',
    DATA: 'Loading vehicle data...',
    POPULATING: 'Populating...',
    EXPORTING: 'Exporting...',
    FILTERING: 'Filtering...',
  },
  PLACEHOLDERS: {
    SELECT_VEHICLE: 'Select a vehicle',
    NO_DATA: 'No data available',
    SEARCH: 'Search...',
  },
  ACTIONS: {
    SEARCH: 'Filter',
    CLEAR: 'Clear',
    EXPORT: 'Export Data',
    POPULATE: 'Populate Data',
    PREVIOUS: 'Previous',
    NEXT: 'Next',
  },
} as const;

// Table Headers
export const TABLE_HEADERS = {
  ID: 'ID',
  TIMESTAMP: 'Timestamp',
  SPEED: 'Speed (mph)',
  ODOMETER: 'Odometer',
  SOC: 'SOC (%)',
  ELEVATION: 'Elevation (ft)',
  SHIFT_STATE: 'Shift State',
} as const;
