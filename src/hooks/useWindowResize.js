/**
 * Window resize hook
 * Replaces duplicated resize listeners in Apply.jsx and ZoneRecordTables.jsx
 */
import { useState, useEffect } from 'react';

/**
 * Hook for tracking window size
 * @returns {Object} { width, height }
 */
export function useWindowResize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook for checking if screen is larger than breakpoint
 * @param {number} breakpoint - Breakpoint in pixels (default 768)
 * @returns {boolean} True if screen width >= breakpoint
 */
export function useIsLargeScreen(breakpoint = 768) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isLargeScreen;
}
