import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminRoute = ({ children, user }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    toast.error('Akses ditolak! Hanya admin yang diizinkan');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
