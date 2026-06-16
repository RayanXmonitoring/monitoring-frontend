import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';

console.log('App.js loaded');

// Simple Layout
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Monitoring System</h1>
        </div>
      </nav>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

// Protected Route
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const { user, loading } = useAuth();
  console.log('AppContent - user:', user, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" /> : <Login />
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/" element={
          <Navigate to={user ? "/dashboard" : "/login"} />
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  console.log('App rendering');
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
