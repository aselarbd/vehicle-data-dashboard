import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { ApiClient } from '../../services/api/client';
import { ApiErrorHandler } from '../../services/api/error-handler';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

// Mock ApiErrorHandler
vi.mock('../../services/api/error-handler', () => ({
  ApiErrorHandler: {
    createError: vi.fn(),
  },
}));

// Mock API_CONFIG
vi.mock('../../constants', () => ({
  API_CONFIG: {
    BASE_URL: 'http://localhost:8000/api/v1/vehicle_data',
    TIMEOUT: 10000,
  },
}));

describe('ApiClient', () => {
  let apiClient: ApiClient;
  let mockAxiosInstance: any;
  let consoleSpy: any;

  beforeEach(() => {
    // Create mock axios instance
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };

    // Mock axios.create to return our mock instance
    mockedAxios.create = vi.fn().mockReturnValue(mockAxiosInstance);

    // Mock console methods to avoid noise in tests
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    };

    // Create new client instance
    apiClient = new ApiClient();

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore console
    consoleSpy.log.mockRestore();
    consoleSpy.error.mockRestore();
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct configuration', () => {
      // Clear previous calls and create a fresh instance to test
      vi.clearAllMocks();
      
      // Create new instance to trigger axios.create call
      new ApiClient();
      
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'http://localhost:8000/api/v1/vehicle_data',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should setup request and response interceptors', () => {
      // The interceptors are set up in constructor, so they should be called when creating a new instance
      vi.clearAllMocks();
      new ApiClient();
      
      // Should be called once for the new instance
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('get method', () => {
    const mockResponseData = { data: 'test data' };
    const mockResponse = { data: mockResponseData };

    it('should make GET request and return data', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-url');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-url', undefined);
      expect(result).toEqual(mockResponseData);
    });

    it('should make GET request with config parameters', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      const config = { params: { page: 1, limit: 10 } };

      const result = await apiClient.get('/test-url', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-url', config);
      expect(result).toEqual(mockResponseData);
    });

    it('should handle GET request errors', async () => {
      const mockError = new Error('Network error');
      const apiError = new Error('Failed to fetch data');
      
      mockAxiosInstance.get.mockRejectedValue(mockError);
      (ApiErrorHandler.createError as any).mockReturnValue(apiError);

      await expect(apiClient.get('/error-url')).rejects.toThrow('Failed to fetch data');

      expect(ApiErrorHandler.createError).toHaveBeenCalledWith(mockError, 'Failed to fetch data');
    });
  });

  describe('post method', () => {
    const mockResponseData = { id: 1, message: 'success' };
    const mockResponse = { data: mockResponseData };

    it('should make POST request and return data', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      const postData = { name: 'test' };

      const result = await apiClient.post('/test-url', postData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-url', postData, undefined);
      expect(result).toEqual(mockResponseData);
    });

    it('should make POST request without data', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/test-url');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-url', undefined, undefined);
      expect(result).toEqual(mockResponseData);
    });

    it('should make POST request with config', async () => {
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      const postData = { name: 'test' };
      const config = { headers: { 'Custom-Header': 'value' } };

      const result = await apiClient.post('/test-url', postData, config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-url', postData, config);
      expect(result).toEqual(mockResponseData);
    });

    it('should handle POST request errors', async () => {
      const mockError = new Error('Server error');
      const apiError = new Error('Failed to post data');
      
      mockAxiosInstance.post.mockRejectedValue(mockError);
      (ApiErrorHandler.createError as any).mockReturnValue(apiError);

      await expect(apiClient.post('/error-url', {})).rejects.toThrow('Failed to post data');

      expect(ApiErrorHandler.createError).toHaveBeenCalledWith(mockError, 'Failed to post data');
    });
  });

  describe('put method', () => {
    const mockResponseData = { updated: true };
    const mockResponse = { data: mockResponseData };

    it('should make PUT request and return data', async () => {
      mockAxiosInstance.put.mockResolvedValue(mockResponse);
      const putData = { id: 1, name: 'updated' };

      const result = await apiClient.put('/test-url/1', putData);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test-url/1', putData, undefined);
      expect(result).toEqual(mockResponseData);
    });

    it('should handle PUT request errors', async () => {
      const mockError = new Error('Update error');
      const apiError = new Error('Failed to update data');
      
      mockAxiosInstance.put.mockRejectedValue(mockError);
      (ApiErrorHandler.createError as any).mockReturnValue(apiError);

      await expect(apiClient.put('/error-url', {})).rejects.toThrow('Failed to update data');

      expect(ApiErrorHandler.createError).toHaveBeenCalledWith(mockError, 'Failed to update data');
    });
  });

  describe('delete method', () => {
    const mockResponseData = { deleted: true };
    const mockResponse = { data: mockResponseData };

    it('should make DELETE request and return data', async () => {
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await apiClient.delete('/test-url/1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test-url/1', undefined);
      expect(result).toEqual(mockResponseData);
    });

    it('should make DELETE request with config', async () => {
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);
      const config = { headers: { 'Authorization': 'Bearer token' } };

      const result = await apiClient.delete('/test-url/1', config);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test-url/1', config);
      expect(result).toEqual(mockResponseData);
    });

    it('should handle DELETE request errors', async () => {
      const mockError = new Error('Delete error');
      const apiError = new Error('Failed to delete data');
      
      mockAxiosInstance.delete.mockRejectedValue(mockError);
      (ApiErrorHandler.createError as any).mockReturnValue(apiError);

      await expect(apiClient.delete('/error-url')).rejects.toThrow('Failed to delete data');

      expect(ApiErrorHandler.createError).toHaveBeenCalledWith(mockError, 'Failed to delete data');
    });
  });

  describe('downloadFile method', () => {
    const mockBlobData = new Blob(['file content'], { type: 'text/csv' });
    const mockResponse = { data: mockBlobData };

    it('should download file and return blob', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiClient.downloadFile('/download-url');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/download-url', {
        params: undefined,
        responseType: 'blob',
      });
      expect(result).toBe(mockBlobData);
    });

    it('should download file with parameters', async () => {
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      const params = { vehicle_id: 'test-123', format: 'CSV' };

      const result = await apiClient.downloadFile('/download-url', params);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/download-url', {
        params: params,
        responseType: 'blob',
      });
      expect(result).toBe(mockBlobData);
    });

    it('should handle download file errors', async () => {
      const mockError = new Error('Download error');
      const apiError = new Error('Failed to download file');
      
      mockAxiosInstance.get.mockRejectedValue(mockError);
      (ApiErrorHandler.createError as any).mockReturnValue(apiError);

      await expect(apiClient.downloadFile('/error-url')).rejects.toThrow('Failed to download file');

      expect(ApiErrorHandler.createError).toHaveBeenCalledWith(mockError, 'Failed to download file');
    });
  });
});
