import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, user }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
