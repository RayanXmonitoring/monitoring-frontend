import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  ShieldCheckIcon,
  UsersIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDevices: 0,
    onlineDevices: 0,
    lostDevices: 0,
    totalResellers: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Akses ditolak! Hanya admin yang diizinkan');
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/activities')
      ]);
      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Gagal memuat data admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('isAdmin');
      navigate('/login');
      toast.success('Logout berhasil');
    } catch (error) {
      toast.error('Gagal logout');
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: 'blue' },
    { label: 'Total Devices', value: stats.totalDevices, icon: DevicePhoneMobileIcon, color: 'green' },
    { label: 'Online Devices', value: stats.onlineDevices, icon: CheckCircleIcon, color: 'green' },
    { label: 'Resellers', value: stats.totalResellers, icon: UserGroupIcon, color: 'purple' }
  ];

  const deviceStatus = [
    { label: 'Online', value: stats.onlineDevices, color: 'green', icon: CheckCircleIcon },
    { label: 'Offline', value: stats.totalDevices - stats.onlineDevices - stats.lostDevices, color: 'gray', icon: XCircleIcon },
    { label: 'Lost', value: stats.lostDevices, color: 'red', icon: ExclamationTriangleIcon }
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <ShieldCheckIcon className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400 text-sm">{user?.email || 'Admin'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-6">Dashboard Overview</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-600/20 rounded-full p-3`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Device Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {deviceStatus.map((status, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{status.label}</p>
                  <p className="text-2xl font-bold text-white">{status.value}</p>
                </div>
                <div className={`bg-${status.color}-600/20 rounded-full p-2`}>
                  <status.icon className={`w-5 h-5 text-${status.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700 flex items-center space-x-2">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-white">Aktivitas Terbaru</h3>
          </div>
          <div className="divide-y divide-gray-700">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 10).map((activity, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-700/30 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'login' ? 'bg-green-500' :
                        activity.type === 'device' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`} />
                      <span className="text-white">{activity.message}</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-400">
                Belum ada aktivitas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
