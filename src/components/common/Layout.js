import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Monitoring System</h1>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
