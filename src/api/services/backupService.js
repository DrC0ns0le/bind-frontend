/**
 * Backup & Restore service
 * Handles export/import operations for DNS zones and configurations
 */
import apiClient from '../client';
import { API_ENDPOINTS } from '../../config/constants';

export const backupService = {
  /**
   * Export data
   * @param {string} type - 'all' | 'zones' | 'configs'
   * @returns {Promise<Object>} Response with data and headers
   */
  async export(type) {
    const endpoints = {
      all: API_ENDPOINTS.EXPORT_ALL,
      zones: API_ENDPOINTS.EXPORT_ZONES,
      configs: API_ENDPOINTS.EXPORT_CONFIGS,
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
      throw new Error(`Unknown export type: ${type}`);
    }

    return await apiClient.get(endpoint);
  },

  /**
   * Import data
   * @param {Object} data - Data to import
   * @param {string} type - 'all' | 'zones' | 'zone' | 'configs'
   * @param {Object} options - { conflict_action, preserve_uuids, dry_run, details }
   * @returns {Promise<Object>} ImportResult
   */
  async import(data, type, options = {}) {
    const { conflict_action, preserve_uuids, dry_run, details } = options;

    // Build query params
    const params = new URLSearchParams();
    if (conflict_action) params.append('conflict_action', conflict_action);
    if (preserve_uuids) params.append('preserve_uuids', 'true');
    if (dry_run) params.append('dry_run', 'true');
    if (details) params.append('details', 'true');

    // Determine endpoint
    const endpoints = {
      all: API_ENDPOINTS.IMPORT_ALL,
      zones: API_ENDPOINTS.IMPORT_ZONES,
      zone: API_ENDPOINTS.IMPORT_ZONE,
      configs: API_ENDPOINTS.IMPORT_CONFIGS,
    };

    const endpoint = endpoints[type];
    if (!endpoint) {
      throw new Error(`Unknown import type: ${type}`);
    }

    const url = params.toString() ? `${endpoint}?${params}` : endpoint;
    const response = await apiClient.post(url, data);

    return response.data.data; // Return ImportResult
  },
};
