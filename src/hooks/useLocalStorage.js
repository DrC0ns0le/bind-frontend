/**
 * localStorage hook with automatic JSON serialization
 * Replaces manual localStorage calls in Frame.jsx and ThemeContext.jsx
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for persisting state to localStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {[any, Function]} [storedValue, setValue]
 */
export function useLocalStorage(key, initialValue) {
  // Initialize state with localStorage value or initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Wrapped setter to match useState API
  const setValue = useCallback((value) => {
    setStoredValue(value);
  }, []);

  return [storedValue, setValue];
}
