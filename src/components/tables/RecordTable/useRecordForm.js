/**
 * Custom hook for record form logic
 * Handles create/update/delete operations for DNS records
 */
import { useState, useCallback } from 'react';
import { useNotification } from '../../ui';
import { recordService } from '../../../api/services/recordService';
import { DNS_DEFAULTS, TIMEOUTS } from '../../../config/constants';

/**
 * Hook for managing DNS record form state and operations
 * @param {string} zoneId - Zone UUID
 * @param {Function} onSuccess - Callback after successful operation
 * @returns {Object} Form state and handlers
 */
export function useRecordForm(zoneId, onSuccess) {
  const addNotification = useNotification();
  const [selectedType, setSelectedType] = useState({});

  /**
   * Handle form submission (create or update record)
   */
  const handleSubmit = useCallback(async (e, record) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const recordData = {
      type: formData.get(`${record.uuid}type`),
      host: formData.get(`${record.uuid}host`),
      content: formData.get(`${record.uuid}content`),
      ttl: parseInt(formData.get(`${record.uuid}ttl`)),
      add_ptr: formData.get(`${record.uuid}add_ptr`) === 'on',
    };

    try {
      if (record.uuid === 'new') {
        // Create new record
        const response = await recordService.createRecord(zoneId, recordData);
        addNotification('success', response.message);
      } else {
        // Update existing record
        const response = await recordService.updateRecord(zoneId, record.uuid, recordData);
        addNotification('success', response.message);
      }

      // Wait before triggering refresh
      await new Promise(resolve => setTimeout(resolve, 300));
      onSuccess();
    } catch (error) {
      const action = record.uuid === 'new' ? 'create' : 'update';
      addNotification('error', `Failed to ${action} record\n${error.message}`);
    }
  }, [zoneId, addNotification, onSuccess]);

  /**
   * Handle record deletion
   */
  const handleDelete = useCallback(async (recordId) => {
    try {
      const response = await recordService.deleteRecord(zoneId, recordId);
      addNotification('success', response.message);

      // Wait longer before refresh for delete
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess();
    } catch (error) {
      addNotification('warning', `Failed to delete record\n${error.message}`);
    }
  }, [zoneId, addNotification, onSuccess]);

  /**
   * Update selected type for a record
   */
  const updateSelectedType = useCallback((recordId, type) => {
    setSelectedType(prev => ({
      ...prev,
      [recordId]: type,
    }));
  }, []);

  /**
   * Initialize selected types from records
   */
  const initializeSelectedTypes = useCallback((records) => {
    const types = {};
    records.forEach(record => {
      types[record.uuid] = record.type;
    });
    setSelectedType(types);
  }, []);

  return {
    selectedType,
    updateSelectedType,
    initializeSelectedTypes,
    handleSubmit,
    handleDelete,
  };
}
