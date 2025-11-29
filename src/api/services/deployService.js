/**
 * Deployment service - Staging, rendering, and deployment operations
 * Handles the DNS configuration deployment workflow
 */
import apiClient from '../client';
import { API_ENDPOINTS } from '../../config/constants';

export const deployService = {
  /**
   * Get staging records (records pending to be applied)
   * @returns {Promise<Object>} { records: Array }
   */
  async getStaging() {
    const response = await apiClient.get(API_ENDPOINTS.STAGING);
    return response.data.data;
  },

  /**
   * Get rendered configuration preview (before/after diff)
   * @returns {Promise<Object>} { before: Object, after: Object }
   */
  async getRender() {
    const response = await apiClient.get(API_ENDPOINTS.RENDER);
    return response.data.data;
  },

  /**
   * Get deployment status/readiness
   * @returns {Promise<boolean>} True if ready to deploy
   */
  async getDeployStatus() {
    const response = await apiClient.get(API_ENDPOINTS.DEPLOY);
    return response.data.data;
  },

  /**
   * Apply staging changes (commit to configuration)
   * @returns {Promise<Object>} Apply response with message
   */
  async applyStaging() {
    const response = await apiClient.post(API_ENDPOINTS.STAGING);
    return response.data;
  },

  /**
   * Deploy the configuration to DNS servers
   * @returns {Promise<Object>} Deployment outcome
   */
  async deploy() {
    const response = await apiClient.post(API_ENDPOINTS.DEPLOY);
    return response.data.data;
  },
};
