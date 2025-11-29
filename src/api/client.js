/**
 * Centralized Axios client with OAuth2/JWT token management
 * Automatically injects JWT tokens in Authorization header
 */
import axios from 'axios';
import { API_CONFIG } from '../config/constants';
import { authInterceptor } from './middleware/authInterceptor';
import { errorInterceptor } from './middleware/errorInterceptor';
import { loggingInterceptor } from './middleware/loggingInterceptor';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptors (executed in order)
apiClient.interceptors.request.use(
  authInterceptor.injectToken,        // Inject JWT token
  authInterceptor.onRequestError
);

apiClient.interceptors.request.use(
  loggingInterceptor.logRequest,
  loggingInterceptor.logRequestError
);

// Response interceptors (executed in reverse order)
apiClient.interceptors.response.use(
  loggingInterceptor.logResponse,
  loggingInterceptor.logResponseError
);

apiClient.interceptors.response.use(
  (response) => response,
  errorInterceptor.handleErrorWithTokenRefresh  // Handle 401 + refresh
);

export default apiClient;
