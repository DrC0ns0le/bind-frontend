/**
 * Custom hook for Apply page workflow
 * Handles staging, rendering, and deployment operations
 */
import { useState, useEffect } from 'react';
import { useNotification } from '../../components/ui';
import { deployService } from '../../api/services/deployService';
import { useMultipleApi } from '../../hooks/useApi';
import { useWindowResize } from '../../hooks/useWindowResize';

/**
 * Hook for managing the apply workflow state and operations
 * @returns {Object} Workflow state and handlers
 */
export function useApplyWorkflow() {
  const addNotification = useNotification();
  const isLargeScreen = useWindowResize('md');
  const [refresh, setRefresh] = useState(Math.floor(Date.now() / 1000));

  // Use useMultipleApi for managing 4 API states:
  // [0] = staging records
  // [1] = render preview
  // [2] = deployment status (ready to deploy)
  // [3] = deployment outcome
  const { data, loading, error, updateData, updateLoading, updateError } = useMultipleApi(4, [true, false, false, false]);

  /**
   * Fetch all data on mount and refresh
   */
  useEffect(() => {
    async function fetchStaging() {
      try {
        const response = await deployService.getStaging();
        updateData(0, response);
        updateLoading(0, false);
      } catch (err) {
        updateError(0, err);
        updateLoading(0, false);
      }
    }

    async function fetchRender() {
      updateLoading(1, true);
      try {
        const response = await deployService.getRender();
        updateData(1, response);
        updateLoading(1, false);
      } catch (err) {
        updateError(1, err);
        updateLoading(1, false);
      }
    }

    async function fetchDeploy() {
      updateLoading(2, true);
      try {
        const response = await deployService.getDeployStatus();
        updateData(2, response);
        updateLoading(2, false);
      } catch (err) {
        updateError(2, err);
        updateLoading(2, false);
      }
    }

    fetchStaging();
    fetchRender();
    fetchDeploy();
  }, [refresh, updateData, updateLoading, updateError]);

  /**
   * Handle applying staging changes
   */
  const handleApply = async () => {
    // Clear staging records
    updateData(0, { records: null });
    updateLoading(2, true);

    try {
      const response = await deployService.applyStaging();
      addNotification('success', response.message);
      updateLoading(2, false);
      setRefresh(Math.floor(Date.now() / 1000));
    } catch (err) {
      addNotification('error', `Failed to apply changes\n${err.message}`);
      updateLoading(2, false);
      updateError(2, err);
      setRefresh(Math.floor(Date.now() / 1000));
    }
  };

  /**
   * Handle deploying the configuration
   */
  const handleDeploy = async () => {
    // Clear staging records
    updateData(0, { records: null });
    // Clear deploy status
    updateData(2, false);
    updateLoading(3, true);

    try {
      const response = await deployService.deploy();
      updateLoading(3, false);
      updateData(3, response);
    } catch (err) {
      updateLoading(3, false);
      updateData(3, err?.response?.data?.data || err.message);
      updateError(3, err);
    }
  };

  return {
    data,
    loading,
    error,
    isLargeScreen,
    handleApply,
    handleDeploy,
    refresh,
    setRefresh,
  };
}
