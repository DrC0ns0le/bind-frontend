/**
 * OAuth2 callback handler component
 * Handles the redirect from OAuth2 provider
 */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState('');
  const processedRef = useRef(false); // Prevent double execution in StrictMode

  useEffect(() => {
    // Prevent double execution (React StrictMode runs effects twice)
    if (processedRef.current) return;
    processedRef.current = true;

    async function processCallback() {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        const errorDesc = searchParams.get('error_description') || errorParam;
        setError(`OAuth error: ${errorDesc}`);
        setTimeout(() => navigate(`/login?error=${encodeURIComponent(errorDesc)}`), 2000);
        return;
      }

      if (!code || !state) {
        const msg = 'Missing authorization code or state';
        setError(msg);
        setTimeout(() => navigate(`/login?error=${encodeURIComponent(msg)}`), 2000);
        return;
      }

      try {
        const result = await handleOAuthCallback(code, state);

        if (result.success) {
          // Redirect to intended destination or home
          const from = sessionStorage.getItem('authRedirect') || '/';
          sessionStorage.removeItem('authRedirect');
          navigate(from, { replace: true });
        } else {
          const msg = result.error?.message || 'Authentication failed';
          setError(msg);
          setTimeout(() => navigate(`/login?error=${encodeURIComponent(msg)}`), 2000);
        }
      } catch (err) {
        const msg = err.message || 'An error occurred during authentication';
        setError(msg);
        setTimeout(() => navigate(`/login?error=${encodeURIComponent(msg)}`), 2000);
      }
    }

    processCallback();
  }, [searchParams, handleOAuthCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center surface">
      <div className="max-w-md w-full p-8 surface-elevated rounded-lg shadow-card text-center">
        {error ? (
          <>
            <div className="text-danger mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-primary">Authentication Failed</h2>
            <p className="text-secondary mb-4">{error}</p>
            <p className="text-sm text-tertiary">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="spinner mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2 text-primary">Authenticating...</h2>
            <p className="text-secondary">Please wait while we complete your login</p>
          </>
        )}
      </div>
    </div>
  );
}
