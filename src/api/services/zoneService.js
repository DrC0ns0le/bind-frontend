/**
 * Zone service - Business logic for zone operations
 * Abstracts API client from components
 */
import apiClient from '../client';
import { API_ENDPOINTS } from '../../config/constants';

export const zoneService = {
  /**
   * Fetch all zones
   * @returns {Promise<Array>} List of zones
   */
  async getZones() {
    const response = await apiClient.get(API_ENDPOINTS.ZONES);
    return response.data.data;
  },

  /**
   * Fetch single zone by ID
   * @param {string} zoneId - Zone UUID
   * @returns {Promise<Object>} Zone data
   */
  async getZone(zoneId) {
    const response = await apiClient.get(API_ENDPOINTS.ZONE_DETAILS(zoneId));
    return response.data.data;
  },

  /**
   * Fetch zone records with pagination and search
   * @param {string} zoneId - Zone UUID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default 1)
   * @param {string} params.search - Search query
   * @returns {Promise<Object>} { records: Array, pagination: Object }
   */
  async getRecords(zoneId, params = {}) {
    const { page = 1, search = '' } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    if (search) {
      queryParams.append('search', search);
    }

    const url = `${API_ENDPOINTS.ZONE_RECORDS(zoneId)}?${queryParams.toString()}`;
    const response = await apiClient.get(url);

    return {
      records: response.data.data.records || [],
      pagination: response.data.data.pagination || null,
    };
  },
};
