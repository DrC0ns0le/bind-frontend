/**
 * Authentication service - OAuth2 + JWT operations
 * Handles login, logout, token refresh, and user info
 */
import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS, STORAGE_KEYS, AUTH_CONFIG } from '../../config/constants';

// Create a separate axios instance WITHOUT auth interceptor for auth endpoints
// This prevents circular dependency and infinite loops during token refresh
const authClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  /**
   * Exchange OAuth2 authorization code for tokens directly with Keycloak
   * @param {string} code - OAuth2 authorization code
   * @param {string} redirectUri - OAuth2 redirect URI
   * @param {string} codeVerifier - PKCE code verifier
   * @returns {Promise<Object>} { token, refreshToken }
   */
  async exchangeCodeForTokens(code, redirectUri, codeVerifier) {
    const tokenUrl = import.meta.env.VITE_OAUTH_TOKEN_URL;
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;

    // Keycloak expects application/x-www-form-urlencoded
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code,
      code_verifier: codeVerifier,
    });

    const response = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return {
      token: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  },

  /**
   * Logout - just clears local tokens (Keycloak session managed separately)
   * @returns {Promise<void>}
   */
  async logout() {
    // Frontend-only logout: local storage cleared by AuthContext
    // Keycloak session can be ended by redirecting to Keycloak's logout endpoint if needed
  },

  /**
   * Refresh access token using refresh token directly with Keycloak
   * @param {string} refreshToken - Current refresh token
   * @returns {Promise<Object>} { token, refreshToken }
   */
  async refreshToken(refreshToken) {
    const tokenUrl = import.meta.env.VITE_OAUTH_TOKEN_URL;
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
    });

    const response = await axios.post(tokenUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return {
      token: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  },

  /**
   * Get current user info from JWT or backend
   * @returns {Promise<Object>} User object
   */
  async getCurrentUser() {
    // Note: Import apiClient here to include auth header
    const { default: apiClient } = await import('../client');
    const response = await apiClient.get(API_ENDPOINTS.AUTH_ME);
    return response.data.data;
  },

  /**
   * Generate PKCE code verifier and challenge
   * - In production: always uses S256 (requires crypto.subtle)
   * - In development: falls back to 'plain' if crypto.subtle unavailable (HTTP dev)
   * @returns {Promise<{verifier: string, challenge: string, method: string}>}
   */
  async generatePKCE() {
    // Generate random code verifier (43-128 chars)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const verifier = btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // If crypto.subtle is available, always prefer S256
    if (crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(verifier);
      const digest = await crypto.subtle.digest('SHA-256', data);
      const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      return { verifier, challenge, method: 'S256' };
    }

    // If crypto.subtle is not available:
    // - In dev, fall back to 'plain' method (verifier === challenge) so HTTP works
    // - In prod, throw so we don't silently weaken security
    if (AUTH_CONFIG.DEV_MODE) {
      console.warn('crypto.subtle unavailable in dev, using plain PKCE method');
      return { verifier, challenge: verifier, method: 'plain' };
    }

    throw new Error('Secure context (crypto.subtle) is required for PKCE S256 in production');
  },

  /**
   * Initiate OAuth2 flow - redirect to provider
   * @param {string} provider - 'google' | 'github' | 'custom'
   */
  async initiateOAuth2Flow(provider = 'custom') {
    const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;
    const authUrl = import.meta.env.VITE_OAUTH_AUTH_URL;

    if (!clientId || !redirectUri || !authUrl) {
      console.error('OAuth2 environment variables not configured');
      return;
    }

    const state = Math.random().toString(36).substring(7); // CSRF protection
    localStorage.setItem(STORAGE_KEYS.OAUTH_STATE, state);

    // Generate PKCE challenge (required by Keycloak)
    const { verifier, challenge, method } = await this.generatePKCE();
    localStorage.setItem(STORAGE_KEYS.PKCE_VERIFIER, verifier);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      state,
      code_challenge: challenge,
      code_challenge_method: method,
    });

    window.location.href = `${authUrl}?${params.toString()}`;
  },
};
