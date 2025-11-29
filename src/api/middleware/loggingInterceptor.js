/**
 * Request/response logging for debugging
 * Only active in development mode
 */

const isDevelopment = import.meta.env.DEV;

export const loggingInterceptor = {
  logRequest: (config) => {
    if (isDevelopment) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }
    return config;
  },

  logRequestError: (error) => {
    if (isDevelopment) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  },

  logResponse: (response) => {
    if (isDevelopment) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },

  logResponseError: (error) => {
    if (isDevelopment && error.response) {
      console.error(`[API Error] ${error.response.status} - ${error.config?.url}`, {
        message: error.response.data?.message,
        data: error.response.data,
      });
    }
    return Promise.reject(error);
  },
};
