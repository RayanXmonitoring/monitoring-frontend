import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  UsersIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: ChartBarIcon, label: 'Dashboard' },
    { id: 'users', icon: UsersIcon, label: 'Kelola User' },
    { id: 'devices', icon: DevicePhoneMobileIcon, label: 'Kelola Device' },
    { id: 'resellers', icon: UserGroupIcon, label: 'Daftar Reseller' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex">
        <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h2>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <p className="text-gray-400">Halaman {activeTab} sedang dalam pengembangan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
