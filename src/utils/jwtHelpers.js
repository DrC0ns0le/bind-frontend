/**
 * JWT token utilities
 * Decode, validate, and extract info from JWT tokens
 */

/**
 * Decode JWT token (client-side only, not for validation)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function decodeJWT(token) {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired
 */
export function isTokenExpired(token) {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();

  return currentTime >= expiryTime;
}

/**
 * Get token expiry time
 * @param {string} token - JWT token
 * @returns {number|null} Expiry timestamp in milliseconds
 */
export function getTokenExpiry(token) {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;
  return decoded.exp * 1000;
}

/**
 * Check if token will expire soon (within buffer time)
 * @param {string} token - JWT token
 * @param {number} bufferMs - Buffer time in milliseconds (default 5 minutes)
 * @returns {boolean} True if expiring soon
 */
export function isTokenExpiringSoon(token, bufferMs = 5 * 60 * 1000) {
  const expiryTime = getTokenExpiry(token);
  if (!expiryTime) return true;

  const currentTime = Date.now();
  return (expiryTime - currentTime) < bufferMs;
}

/**
 * Extract user info from JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} User info or null
 */
export function getUserFromToken(token) {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    id: decoded.sub || decoded.user_id,
    email: decoded.email,
    name: decoded.name,
    roles: decoded.roles || [],
    // Add other fields as needed based on your JWT structure
  };
}
