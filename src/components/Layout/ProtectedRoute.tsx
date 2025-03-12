
/**
 * Protected Route Component
 * 
 * A wrapper component that protects routes requiring authentication.
 * Redirects unauthenticated users to the sign-in page.
 * 
 * Interacts with:
 * - AuthContext to check authentication status
 * - Router for redirection
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // Show loading state while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d1425]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
