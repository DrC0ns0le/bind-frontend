/**
 * Authentication context with OAuth2 + JWT support
 * Manages user session, tokens, and authentication state
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/services/authService';
import { STORAGE_KEYS, TIMEOUTS } from '../config/constants';
import { decodeJWT, isTokenExpired, isTokenExpiringSoon, getUserFromToken } from '../utils/jwtHelpers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
  const [loading, setLoading] = useState(true);

  /**
   * Clear all auth tokens from storage (inline helper)
   */
  const doClearTokens = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  };

  /**
   * Initialize auth state from stored tokens
   */
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    // Check if token is expired
    if (isTokenExpired(storedToken)) {
      console.log('Stored token expired, clearing session');
      doClearTokens();
      setLoading(false);
      return;
    }

    // Token is valid, extract user info
    const userInfo = getUserFromToken(storedToken);
    setUser(userInfo);
    setLoading(false);
  }, []);

  /**
   * Initiate OAuth2 flow
   */
  const loginWithOAuth = useCallback((provider = 'custom') => {
    authService.initiateOAuth2Flow(provider);
  }, []);

  /**
   * Handle OAuth2 callback (exchange code for tokens)
   */
  const handleOAuthCallback = useCallback(async (code, state) => {
    // Verify state for CSRF protection
    const storedState = localStorage.getItem(STORAGE_KEYS.OAUTH_STATE);
    if (state !== storedState) {
      throw new Error('Invalid OAuth state');
    }

    try {
      const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;
      const codeVerifier = localStorage.getItem(STORAGE_KEYS.PKCE_VERIFIER);
      const { token: accessToken, refreshToken: newRefreshToken } = await authService.exchangeCodeForTokens(code, redirectUri, codeVerifier);

      // Extract user info from JWT
      const userInfo = getUserFromToken(accessToken);

      setToken(accessToken);
      setUser(userInfo);

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
      localStorage.removeItem(STORAGE_KEYS.OAUTH_STATE);
      localStorage.removeItem(STORAGE_KEYS.PKCE_VERIFIER);

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, []);

  /**
   * Logout - clear tokens and state
   */
  const logout = useCallback(() => {
    doClearTokens();
  }, []);

  /**
   * Manually refresh token
   */
  const refreshAuthToken = useCallback(async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const { token: newToken } = await authService.refreshToken(refreshToken);
      setToken(newToken);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);

      const userInfo = getUserFromToken(newToken);
      setUser(userInfo);

      return newToken;
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !isTokenExpired(token),
    loginWithOAuth,
    handleOAuthCallback,
    logout,
    refreshToken: refreshAuthToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
