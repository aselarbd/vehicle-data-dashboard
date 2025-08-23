import type { ApiError } from '../../types';
import { ERROR_MESSAGES } from '../../constants';

export class ApiErrorHandler {
  static createError(error: any, fallbackMessage: string): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || fallbackMessage,
        status: error.response.status,
        code: error.response.data?.code,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: ERROR_MESSAGES.NETWORK,
        status: 0,
      };
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      return {
        message: ERROR_MESSAGES.TIMEOUT,
        status: 408,
      };
    } else {
      // Something else happened
      return {
        message: error.message || fallbackMessage,
        status: 500,
      };
    }
  }

  static handleError(error: any, fallbackMessage: string): never {
    const apiError = this.createError(error, fallbackMessage);
    console.error('API Error:', apiError);
    throw new Error(apiError.message);
  }
}
