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
      <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg bg-gray-150">
        <div className="max-w-md w-full p-8 bg-white dark:bg-dark-elevated rounded-lg shadow-gb2 dark:shadow-dark-gb2">
          <h1 className="text-3xl font-bold text-center mb-8 dark:text-gray-300">
            BIND DNS Manager
          </h1>

          <div className="mb-6">
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              <p className="font-semibold mb-1">Authentication Failed</p>
              <p className="text-sm">{decodeURIComponent(errorMessage)}</p>
            </div>

            <button
              onClick={handleRetryLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg shadow-gb2 hover:shadow-gba2 transition-all disabled:opacity-50"
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
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-dark-bg bg-gray-150">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
    </div>
  );
}
