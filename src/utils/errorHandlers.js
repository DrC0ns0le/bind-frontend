/**
 * Error handling utilities
 * Safe error message extraction and error formatting
 */

import { ERROR_MESSAGES, HTTP_STATUS } from '../config/constants';

/**
 * Safely extracts error message from various error formats
 * Prevents crashes from undefined properties
 *
 * @param {Error|Object} error - The error object
 * @param {string} fallback - Fallback message if extraction fails
 * @returns {string} - Extracted or fallback error message
 */
export const getErrorMessage = (error, fallback = ERROR_MESSAGES.UNKNOWN_ERROR) => {
  if (!error) return fallback;

  // Axios error with response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error with response data as string
  if (error.response?.data && typeof error.response.data === 'string') {
    return error.response.data;
  }

  // Axios error with status text
  if (error.response?.statusText) {
    return error.response.statusText;
  }

  // Standard Error object
  if (error.message) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return fallback;
};

/**
 * Get HTTP status code from error
 *
 * @param {Error|Object} error - The error object
 * @returns {number|null} - HTTP status code or null
 */
export const getErrorStatus = (error) => {
  return error?.response?.status || null;
};

/**
 * Determines if error is a network error
 *
 * @param {Error|Object} error - The error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return error?.message === 'Network Error' || error?.code === 'ERR_NETWORK';
};

/**
 * Determines if error is an authentication error
 *
 * @param {Error|Object} error - The error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  const status = getErrorStatus(error);
  return status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN;
};

/**
 * Get user-friendly error message based on status code
 *
 * @param {Error|Object} error - The error object
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyError = (error) => {
  if (isNetworkError(error)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const status = getErrorStatus(error);

  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN;
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND;
    case HTTP_STATUS.BAD_REQUEST:
    case HTTP_STATUS.CONFLICT:
      return getErrorMessage(error, ERROR_MESSAGES.VALIDATION_ERROR);
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return getErrorMessage(error, ERROR_MESSAGES.UNKNOWN_ERROR);
  }
};

/**
 * Format error for logging (removes sensitive data)
 *
 * @param {Error|Object} error - The error object
 * @returns {Object} - Sanitized error object for logging
 */
export const formatErrorForLogging = (error) => {
  return {
    message: getErrorMessage(error),
    status: getErrorStatus(error),
    timestamp: new Date().toISOString(),
    // Include stack trace in development only
    ...(import.meta.env.DEV && { stack: error?.stack }),
  };
};

/**
 * Create a standardized error object
 *
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {Object} details - Additional error details
 * @returns {Object} - Standardized error object
 */
export const createError = (message, status = null, details = {}) => {
  return {
    message,
    status,
    details,
    timestamp: new Date().toISOString(),
  };
};
