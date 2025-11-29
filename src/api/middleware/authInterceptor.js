/**
 * Authentication interceptor - injects JWT tokens
 * Retrieves token from localStorage and adds to Authorization header
 */
import { STORAGE_KEYS } from '../../config/constants';

export const authInterceptor = {
  /**
   * Inject JWT token into Authorization header
   */
  injectToken: (config) => {
    // Skip auth injection if explicitly disabled
    if (config.skipAuthInterceptor) {
      return config;
    }

    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  onRequestError: (error) => {
    return Promise.reject(error);
  },
};

/**
 * Helper: Get current auth token
 */
export function getAuthToken() {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * Helper: Set auth token
 */
export function setAuthToken(token) {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

/**
 * Helper: Clear auth token
 */
export function clearAuthToken() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}
