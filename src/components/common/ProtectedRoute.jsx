import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Route guard to prevent unauthenticated access to dashboard layouts/routes.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          {/* Minimal professional loading spinner */}
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Loading PlaceTrack...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location the user tried to go to, redirecting back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
