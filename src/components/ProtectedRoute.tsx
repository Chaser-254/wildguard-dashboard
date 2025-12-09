import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}
export function ProtectedRoute({
  children,
  allowedRoles
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
    user
  } = useAuth();
  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div className="h-screen w-screen flex items-center justify-center bg-slate-100">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>;
  }
  return <>{children}</>;
}