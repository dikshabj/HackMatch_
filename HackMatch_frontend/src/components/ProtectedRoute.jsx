import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Generic protected route — just needs login
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const { user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, wait for user to load then check
  if (requiredRole && user) {
    const hasRole = user.roles?.some((r) => r.name === requiredRole);
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
