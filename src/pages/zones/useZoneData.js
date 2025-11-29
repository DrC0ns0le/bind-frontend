/**
 * Custom hook for zone data fetching and management
 * Replaces all business logic from Zone.jsx
 */
import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useMultipleApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import { zoneService } from '../../api/services/zoneService';

/**
 * Hook for managing zone data, records, pagination, and search
 * @param {string} zoneId - The zone UUID
 * @returns {Object} Zone data, records, loading states, and control functions
 */
export function useZoneData(zoneId) {
  const [searchQuery, setSearchQuery] = useState('');
  const [refresh, setRefresh] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const { currentPage, pagination, setPagination, handlePageChange, resetPage } = usePagination();

  const {
    data,
    loading,
    error,
    updateData,
    updateLoading,
    updateError,
  } = useMultipleApi(2); // 0 = zone data, 1 = records data

  // Fetch zone details (only when zoneId changes)
  useEffect(() => {
    async function fetchZone() {
      updateLoading(0, true);
      try {
        const zoneData = await zoneService.getZone(zoneId);
        updateData(0, zoneData);
      } catch (err) {
        updateError(0, err);
      } finally {
        updateLoading(0, false);
      }
    }

    fetchZone();
  }, [zoneId]); // Only dependency is zoneId

  // Fetch records with debounced search
  useEffect(() => {
    async function fetchRecords() {
      updateLoading(1, true);
      try {
        const { records, pagination: paginationData } = await zoneService.getRecords(
          zoneId,
          { page: currentPage, search: debouncedSearch }
        );
        updateData(1, { records });
        setPagination(paginationData);
      } catch (err) {
        updateError(1, err);
      } finally {
        updateLoading(1, false);
      }
    }

    fetchRecords();

    // Reset refresh flag after fetching
    if (refresh) {
      setRefresh(false);
    }
  }, [zoneId, currentPage, debouncedSearch, refresh]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      resetPage();
    }
  }, [searchQuery]);

  return {
    zoneData: data[0],
    recordsData: data[1],
    loading,
    error,
    searchQuery,
    setSearchQuery,
    refresh,
    setRefresh,
    pagination,
    currentPage,
    handlePageChange,
  };
}
