import React from 'react';
import { useAuth } from '../../context/AuthContext';

console.log('Dashboard component loaded');

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  console.log('Dashboard render - user:', user?.email);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/20">
        <h1 className="text-2xl font-bold text-white">
          Selamat datang, {user?.email?.split('@')[0] || 'User'}!
        </h1>
        {isAdmin && (
          <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
            🛡️ Admin
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400">Total Devices</p>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400">Online</p>
          <p className="text-3xl font-bold text-green-400">0</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400">Lost</p>
          <p className="text-3xl font-bold text-red-400">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
