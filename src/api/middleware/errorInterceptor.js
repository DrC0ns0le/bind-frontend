/**
 * Global error handling interceptor with automatic JWT token refresh
 * Handles 401 responses by attempting token refresh and retrying request
 */
import { getErrorMessage } from '../../utils/errorHandlers';
import { STORAGE_KEYS, HTTP_STATUS } from '../../config/constants';

let isRefreshing = false;
let failedRequestsQueue = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedRequestsQueue = [];
};

export const errorInterceptor = {
  /**
   * Handle errors with automatic token refresh on 401
   */
  handleErrorWithTokenRefresh: async (error) => {
    const originalRequest = error.config;

    // Network error (no response)
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        type: 'network',
        originalError: error,
      });
    }

    const status = error.response.status;

    // Handle 401 Unauthorized - attempt token refresh or transparently re-login
    if (status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      // Import apiClient and authService dynamically to avoid circular dependency
      const { default: apiClient } = await import('../client');
      const { authService } = await import('../services/authService');

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        isRefreshing = false;
        // No refresh token available – transparently re-initiate OAuth2 login
        console.warn('[Auth] No refresh token available, starting new login flow');
        authService.initiateOAuth2Flow('custom');
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const { token: newAccessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);

        // Update stored tokens
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        // Update axios default header
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        // Update original request header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed
        processQueue(refreshError, null);

        // Clear tokens
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

        // Start a fresh OAuth2 login flow instead of redirecting to /login
        console.warn('[Auth] Token refresh failed, starting new login flow');
        authService.initiateOAuth2Flow('custom');

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other HTTP errors
    const message = getErrorMessage(error);

    switch (status) {
      case HTTP_STATUS.FORBIDDEN:
        console.warn('[API] Forbidden request');
        break;
      case HTTP_STATUS.NOT_FOUND:
        console.warn('[API] Resource not found');
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        console.error('[API] Server error');
        break;
      default:
        break;
    }

    return Promise.reject({
      message,
      status,
      type: 'http',
      originalError: error,
    });
  },
};
