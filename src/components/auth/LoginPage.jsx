/**
 * Login page component - OAuth2 only
 * Only shown when there's an auth error, otherwise auto-redirects to OAuth
 */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function LoginPage() {
  const { loginWithOAuth, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get error from URL params (e.g., from failed OAuth callback)
  const searchParams = new URLSearchParams(location.search);
  const errorMessage = searchParams.get('error');

  // Auto-redirect to OAuth if no error and not authenticated
  useEffect(() => {
    if (!errorMessage && !isAuthenticated && !isLoading) {
      setIsLoading(true);
      loginWithOAuth('custom');
    }
  }, [errorMessage, isAuthenticated, isLoading, loginWithOAuth]);

  const handleRetryLogin = async () => {
    setIsLoading(true);
    await loginWithOAuth('custom');
  };

  // If there's an error, show the login page with error info
  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center surface">
        <div className="max-w-md w-full p-8 surface-elevated rounded-lg shadow-card">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary">
            BIND DNS Manager
          </h1>

          <div className="mb-6">
            <div className="mb-4 p-4 bg-danger-subtle text-danger rounded-lg">
              <p className="font-semibold mb-1">Authentication Failed</p>
              <p className="text-sm">{decodeURIComponent(errorMessage)}</p>
            </div>

            <button
              onClick={handleRetryLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-button transition-all disabled:opacity-50"
            >
              {isLoading ? 'Redirecting...' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while auto-redirecting to OAuth
  return (
    <div className="min-h-screen flex flex-col items-center justify-center surface">
      <div className="spinner mb-4"></div>
      <p className="text-secondary">Redirecting to login...</p>
    </div>
  );
}
