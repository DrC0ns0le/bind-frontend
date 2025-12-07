/**
 * Data formatting and normalization utilities
 */

/**
 * Normalize zone data from API
 * @param {Object} rawData
 * @returns {Object}
 */
export function normalizeZoneData(rawData) {
  return {
    uuid: rawData.uuid,
    name: rawData.name,
    // Add other fields as needed
  };
}

/**
 * Normalize records data with pagination
 * @param {Object} rawData
 * @returns {Object}
 */
export function normalizeRecordsData(rawData) {
  return {
    records: rawData.records || [],
    pagination: rawData.pagination || null,
  };
}

/**
 * Calculate record status class name based on staging status
 * Extracted from ZoneRecordTables.jsx
 * @param {Object} record - The DNS record object
 * @returns {string} The CSS class for background color
 */
export function getRecordStatusClassName(record) {
  if (!record.staging) {
    return '';
  }

  // Record is staged for deletion
  if (record.deleted_at !== 0) {
    return 'bg-danger-subtle';
  }

  // Record is newly created (not modified)
  if (record.created_at === record.modified_at) {
    return 'bg-success-subtle';
  }

  // Record is modified
  return 'bg-modified-subtle';
}

/**
 * Format timestamp to human-readable date
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleString();
}

/**
 * Format TTL value with appropriate unit
 * @param {number} ttl - Time to live in seconds
 * @returns {string} Formatted TTL string
 */
export function formatTTL(ttl) {
  if (!ttl) return '0s';

  const hours = Math.floor(ttl / 3600);
  const minutes = Math.floor((ttl % 3600) / 60);
  const seconds = ttl % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
