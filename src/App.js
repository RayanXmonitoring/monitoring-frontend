import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import Admin from './components/admin/Admin';
import AdminUsers from './components/admin/AdminUsers';
import AdminDevices from './components/admin/AdminDevices';
import AdminResellers from './components/admin/AdminResellers';
import DeviceGallery from './components/monitoring/DeviceGallery';
import SMSViewer from './components/monitoring/SMSViewer';
import LiveCamera from './components/monitoring/LiveCamera';
import LiveMonitoring from './components/monitoring/LiveMonitoring';
import DeviceLock from './components/monitoring/DeviceLock';
import StealerC2 from './components/stealer/StealerC2';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '12px'
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <Login />
        } />
        
        <Route path="/" element={
          <ProtectedRoute user={user}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="gallery" element={<DeviceGallery />} />
          <Route path="sms" element={<SMSViewer />} />
          <Route path="camera" element={<LiveCamera />} />
          <Route path="monitoring" element={<LiveMonitoring />} />
          <Route path="device-lock" element={<DeviceLock />} />
          <Route path="stealer" element={<StealerC2 />} />
          
          <Route path="admin" element={
            <AdminRoute user={user}>
              <Admin />
            </AdminRoute>
          } />
          <Route path="admin/users" element={
            <AdminRoute user={user}>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="admin/devices" element={
            <AdminRoute user={user}>
              <AdminDevices />
            </AdminRoute>
          } />
          <Route path="admin/resellers" element={
            <AdminRoute user={user}>
              <AdminResellers />
            </AdminRoute>
          } />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
