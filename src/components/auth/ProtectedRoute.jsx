/**
 * Protected route wrapper for authenticated routes
 * Automatically initiates OAuth login if not authenticated
 *
 * DEV MODE BYPASS:
 * Set VITE_AUTH_BYPASS=true in .env.development to bypass authentication in dev mode
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AUTH_CONFIG } from '../../config/constants';

/**
 * Loading spinner with message
 */
function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen surface">
      <div className="spinner mb-4"></div>
      <p className="text-secondary">{message}</p>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, loginWithOAuth } = useAuth();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Dev mode bypass - just return children
  if (AUTH_CONFIG.BYPASS_AUTH && AUTH_CONFIG.DEV_MODE) {
    return children;
  }

  // Auto-login effect: if not authenticated and not loading, start OAuth flow
  useEffect(() => {
    if (!loading && !isAuthenticated && !isRedirecting) {
      // Save intended destination for after login
      sessionStorage.setItem('authRedirect', location.pathname);
      setIsRedirecting(true);
      // Automatically start OAuth login
      loginWithOAuth('custom');
    }
  }, [loading, isAuthenticated, isRedirecting, location.pathname, loginWithOAuth]);

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Show redirecting message while OAuth flow starts
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  return children;
}
