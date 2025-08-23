// Common API types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

// Loading and error states
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Status message types
export interface StatusMessage {
  type: 'success' | 'error' | 'warning' | 'info' | null;
  message: string;
}
