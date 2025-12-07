/**
 * Main App component with routing and providers
 * Integrated with AuthProvider for OAuth2/JWT authentication
 * Uses React.lazy for code splitting and performance optimization
 */
import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NotificationProviderWithStyles, SpinningCog } from './components/ui';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AUTH_CONFIG } from './config/constants';

// Lazy load page components for code splitting
const Home = React.lazy(() => import('./Home'));
const Zones = React.lazy(() => import('./pages/zones/Zones'));
const Zone = React.lazy(() => import('./pages/zones/Zone'));
const Apply = React.lazy(() => import('./pages/apply/Apply'));
const Configuration = React.lazy(() => import('./pages/configuration/Configuration'));
const BackupRestore = React.lazy(() => import('./pages/configuration/BackupRestore'));
const WrongPage = React.lazy(() => import('./Errors'));
const LoginPage = React.lazy(() => import('./components/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const OAuthCallback = React.lazy(() => import('./components/auth/OAuthCallback').then(module => ({ default: module.OAuthCallback })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    {SpinningCog()}
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProviderWithStyles>
          {/* Dev mode warning banner - outside of routing */}
          {AUTH_CONFIG.BYPASS_AUTH && AUTH_CONFIG.DEV_MODE && (
            <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 font-semibold text-sm z-50">
              ⚠️ DEV MODE: Authentication bypassed (VITE_AUTH_BYPASS=true)
            </div>
          )}
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/callback" element={<OAuthCallback />} />

                {/* Protected routes - require authentication */}
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/zones" element={<ProtectedRoute><Zones /></ProtectedRoute>} />
                <Route path="/zone">
                  <Route path=":zone" element={<ProtectedRoute><Zone /></ProtectedRoute>} />
                </Route>
                <Route path="/configuration" element={<ProtectedRoute><Configuration /></ProtectedRoute>} />
                <Route path="/configuration/backup" element={<ProtectedRoute><BackupRestore /></ProtectedRoute>} />
                <Route path="/apply" element={<ProtectedRoute><Apply /></ProtectedRoute>} />
                <Route path="*" element={<ProtectedRoute><WrongPage /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </Router>
        </NotificationProviderWithStyles>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
