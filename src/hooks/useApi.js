/**
 * Generic hook for API calls with loading/error states
 * Replaces duplicated state management pattern across components
 */
import { useState, useCallback } from 'react';

/**
 * Generic API hook for single API call
 * @param {Function} apiFunc - The async API function to call
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback on successful response
 * @param {Function} options.onError - Callback on error
 * @param {boolean} options.immediate - Execute immediately on mount
 * @returns {Object} { data, loading, error, execute, setData }
 */
export function useApi(apiFunc, options = {}) {
  const { onSuccess, onError, immediate = false } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunc(...args);
      setData(result);
      onSuccess?.(result);
      return { data: result, error: null };
    } catch (err) {
      setError(err);
      onError?.(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [apiFunc, onSuccess, onError]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
}

/**
 * Hook for managing multiple API calls (like Zone.jsx pattern)
 * Replaces the manual updateData/updateLoading/updateError helpers
 * @param {number} count - Number of API calls to manage
 * @param {boolean[]} initialLoading - Optional initial loading states
 * @returns {Object} { data, loading, error, updateData, updateLoading, updateError }
 */
export function useMultipleApi(count, initialLoading = null) {
  const [data, setData] = useState(Array(count).fill(null));
  const [loading, setLoading] = useState(initialLoading || Array(count).fill(false));
  const [error, setError] = useState(Array(count).fill(null));

  const updateData = useCallback((index, value) => {
    setData(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const updateLoading = useCallback((index, value) => {
    setLoading(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const updateError = useCallback((index, value) => {
    setError(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  return {
    data,
    loading,
    error,
    updateData,
    updateLoading,
    updateError,
  };
}
