/**
 * Pagination state management hook
 * Replaces manual pagination state in Zone.jsx
 */
import { useState, useCallback } from 'react';

/**
 * Hook for managing pagination state
 * @param {number} initialPage - Initial page number (default 1)
 * @returns {Object} { currentPage, pagination, setPagination, handlePageChange, resetPage }
 */
export function usePagination(initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagination, setPagination] = useState(null);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    pagination,
    setPagination,
    handlePageChange,
    resetPage,
  };
}
