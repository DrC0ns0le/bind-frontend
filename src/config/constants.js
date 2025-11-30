/**
 * Application-wide constants
 * Centralized configuration for DNS types, timeouts, localStorage keys, etc.
 */

// API Configuration
export const API_CONFIG = {
  // Try runtime config first (window.ENV), fallback to build-time values
  BASE_URL: window.ENV?.VITE_API_URL || import.meta.env.VITE_API_URL || 'https://bind.internal.leejacksonz.com/',
  TIMEOUT: 30000, // 30 seconds
  VERSION: 'v1',
};

// Auth Configuration
export const AUTH_CONFIG = {
  // Set VITE_AUTH_BYPASS=true in .env.development to bypass auth in dev mode
  // Try runtime config first, fallback to build-time values
  BYPASS_AUTH: (window.ENV?.VITE_AUTH_BYPASS || import.meta.env.VITE_AUTH_BYPASS) === 'true',
  DEV_MODE: import.meta.env.DEV,
};

// API Endpoints (relative to BASE_URL)
export const API_ENDPOINTS = {
  // Zones
  ZONES: 'api/v1/zones',
  ZONE_DETAILS: (zoneId) => `api/v1/zones/${zoneId}`,
  ZONE_RECORDS: (zoneId) => `api/v1/zones/${zoneId}/records`,
  ZONE_RECORD: (zoneId, recordId) => `api/v1/zones/${zoneId}/records/${recordId}`,

  // Records
  RECORD_TYPES: 'api/v1/records/types',

  // Deployment
  STAGING: 'api/v1/staging',
  RENDER: 'api/v1/render',
  DEPLOY: 'api/v1/deploy',

  // Auth (prepared for future OAuth2/JWT implementation)
  AUTH_LOGIN: 'api/v1/auth/login',
  AUTH_LOGOUT: 'api/v1/auth/logout',
  AUTH_REFRESH: 'api/v1/auth/refresh',
  AUTH_CALLBACK: 'api/v1/auth/callback',
  AUTH_ME: 'api/v1/auth/me',
};

// DNS Record Types (fallback if API fails)
export const DNS_RECORD_TYPES = [
  'A',
  'AAAA',
  'CAA',
  'CNAME',
  'MX',
  'NS',
  'PTR',
  'SOA',
  'SRV',
  'TXT',
];

// Default DNS Values
export const DNS_DEFAULTS = {
  TTL: 3600,
  PRIORITY: 10,
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  THEME: 'darkMode',
  SIDEBAR_EXPANDED: 'sidebarExpanded',
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
  OAUTH_STATE: 'oauthState',
  PKCE_VERIFIER: 'pkceVerifier',
};

// Timeouts & Delays
export const TIMEOUTS = {
  NOTIFICATION_DISMISS: 5000, // 5 seconds
  DEBOUNCE_SEARCH: 500, // 0.5 seconds
  API_TIMEOUT: 30000, // 30 seconds
  TOKEN_REFRESH_BUFFER: 300000, // 5 minutes before expiry
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
  MAX_PAGE_BUTTONS: 5,
};

// Responsive Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Routes
export const ROUTES = {
  HOME: '/',
  ZONES: '/zones',
  ZONE_DETAILS: (zoneId) => `/zones/${zoneId}`,
  APPLY: '/apply',
  ERRORS: '/errors',
  LOGIN: '/login',
};

// Record Status Colors (for styling)
export const RECORD_STATUS = {
  ACTIVE: 'active',
  STAGED: 'staged',
  MODIFIED: 'modified',
  DELETED: 'deleted',
};
