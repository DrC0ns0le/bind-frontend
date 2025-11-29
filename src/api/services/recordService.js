/**
 * Record service - DNS record CRUD operations
 * Handles creating, updating, and deleting DNS records
 */
import apiClient from '../client';
import { API_ENDPOINTS, DNS_RECORD_TYPES } from '../../config/constants';

export const recordService = {
  /**
   * Get supported DNS record types from API
   * Falls back to hardcoded list if API fails
   * @returns {Promise<Array<string>>} List of supported record types
   */
  async getRecordTypes() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.RECORD_TYPES);
      return response.data.data.types || DNS_RECORD_TYPES;
    } catch (error) {
      console.warn('Failed to fetch record types from API, using fallback:', error);
      return DNS_RECORD_TYPES;
    }
  },

  /**
   * Create a new DNS record
   * @param {string} zoneId - Zone UUID
   * @param {Object} recordData - Record data
   * @param {string} recordData.type - Record type (A, AAAA, CNAME, etc.)
   * @param {string} recordData.host - Hostname
   * @param {string} recordData.content - Record content
   * @param {number} recordData.ttl - Time to live
   * @param {boolean} recordData.add_ptr - Add PTR record (for A/AAAA)
   * @returns {Promise<Object>} Created record
   */
  async createRecord(zoneId, recordData) {
    const response = await apiClient.post(
      API_ENDPOINTS.ZONE_RECORDS(zoneId),
      recordData
    );
    return response.data;
  },

  /**
   * Update an existing DNS record
   * @param {string} zoneId - Zone UUID
   * @param {string} recordId - Record UUID
   * @param {Object} recordData - Updated record data
   * @returns {Promise<Object>} Updated record
   */
  async updateRecord(zoneId, recordId, recordData) {
    const response = await apiClient.put(
      API_ENDPOINTS.ZONE_RECORD(zoneId, recordId),
      recordData
    );
    return response.data;
  },

  /**
   * Delete a DNS record
   * @param {string} zoneId - Zone UUID
   * @param {string} recordId - Record UUID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteRecord(zoneId, recordId) {
    const response = await apiClient.delete(
      API_ENDPOINTS.ZONE_RECORD(zoneId, recordId)
    );
    return response.data;
  },
};
