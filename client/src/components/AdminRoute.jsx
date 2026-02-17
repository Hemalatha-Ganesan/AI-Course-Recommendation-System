import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const AdminRoute = ({ children }) => {
  const { user } = useUser();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin → go to user dashboard
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin → show admin content
  return children;
};

export default AdminRoute;