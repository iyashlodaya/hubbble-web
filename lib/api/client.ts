/**
 * Axios client instance with interceptors
 * Handles base URL, authentication, and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Get base URL from environment variable or use default
const getBaseURL = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use NEXT_PUBLIC_ prefix
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
  }
  // Server-side: can use different URL if needed
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
};

/**
 * Create axios instance with default config
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getBaseURL(),
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Request interceptor
   * - Add auth token if available
   * - Add common headers
   */
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get auth token from localStorage (or your auth storage)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Add request ID for tracking (optional)
      if (config.headers) {
        config.headers['X-Request-ID'] = `${Date.now()}-${Math.random()}`;
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor
   * - Handle common errors
   * - Transform response data
   * - Handle token refresh (if needed)
   */
  instance.interceptors.response.use(
    (response) => {
      // If your API wraps responses, extract data
      // return response.data;
      
      // Otherwise, return response as-is
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Clear auth token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          // Only redirect if not already on login/signup page
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
            window.location.href = '/login';
          }
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        // Handle forbidden access
        console.error('Access forbidden');
      }

      // Handle network errors
      if (!error.response) {
        console.error('Network error:', error.message);
      }

      // Transform error to consistent format
      const errorData = error.response?.data as any;
      const apiError = {
        message: errorData?.message || error.message || 'An error occurred',
        errors: errorData?.errors,
        statusCode: error.response?.status,
      };

      return Promise.reject(apiError);
    }
  );

  return instance;
};

// Export singleton instance
export const apiClient = createAxiosInstance();

// Export axios for direct use if needed
export { axios };

