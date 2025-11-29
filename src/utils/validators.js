/**
 * Input validation utilities for forms
 */
import { DNS_RECORD_TYPES } from '../config/constants';

/**
 * Validate DNS record type
 * @param {string} type
 * @returns {boolean}
 */
export function isValidRecordType(type) {
  return DNS_RECORD_TYPES.includes(type);
}

/**
 * Validate IPv4 address
 * @param {string} ip
 * @returns {boolean}
 */
export function isValidIPv4(ip) {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;

  const parts = ip.split('.');
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
}

/**
 * Validate IPv6 address (simplified)
 * @param {string} ip
 * @returns {boolean}
 */
export function isValidIPv6(ip) {
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(ip);
}

/**
 * Validate hostname
 * @param {string} hostname
 * @returns {boolean}
 */
export function isValidHostname(hostname) {
  const hostnameRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  return hostnameRegex.test(hostname);
}

/**
 * Validate TTL value
 * @param {number} ttl
 * @returns {boolean}
 */
export function isValidTTL(ttl) {
  return Number.isInteger(ttl) && ttl > 0 && ttl <= 2147483647;
}

/**
 * Validate email address
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate DNS record data based on type
 * @param {Object} record - { type, host, content, ttl }
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateDNSRecord(record) {
  const errors = [];

  if (!isValidRecordType(record.type)) {
    errors.push('Invalid record type');
  }

  if (!record.host || record.host.trim() === '') {
    errors.push('Hostname is required');
  }

  if (!record.content || record.content.trim() === '') {
    errors.push('Content is required');
  }

  if (!isValidTTL(record.ttl)) {
    errors.push('Invalid TTL value');
  }

  // Type-specific validation
  switch (record.type) {
    case 'A':
      if (!isValidIPv4(record.content)) {
        errors.push('Invalid IPv4 address');
      }
      break;
    case 'AAAA':
      if (!isValidIPv6(record.content)) {
        errors.push('Invalid IPv6 address');
      }
      break;
    case 'CNAME':
    case 'NS':
      if (!isValidHostname(record.content)) {
        errors.push('Invalid hostname');
      }
      break;
    default:
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
