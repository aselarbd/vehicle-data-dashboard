// Date and time formatting
export const DATE_FORMATS = {
  DISPLAY: 'MM/dd/yyyy HH:mm:ss',
  ISO: 'yyyy-MM-dd\'T\'HH:mm:ss',
  DATE_ONLY: 'MM/dd/yyyy',
  TIME_ONLY: 'HH:mm:ss',
} as const;

// Validation patterns
export const VALIDATION = {
  VEHICLE_ID_PATTERN: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  DATETIME_PATTERN: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
} as const;

// CSS Class names (for consistency)
export const CSS_CLASSES = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
  DISABLED: 'disabled',
  ACTIVE: 'active',
  HIDDEN: 'hidden',
} as const;
