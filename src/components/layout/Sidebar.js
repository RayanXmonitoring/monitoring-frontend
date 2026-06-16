import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  VideoCameraIcon,
  CameraIcon,
  KeyIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  FolderIcon,
  ChatBubbleLeftIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
    { path: '/gallery', icon: FolderIcon, label: 'Device Gallery' },
    { path: '/sms', icon: ChatBubbleLeftIcon, label: 'Lihat SMS' },
    { path: '/camera', icon: CameraIcon, label: 'Live Camera' },
    { path: '/monitoring', icon: VideoCameraIcon, label: 'Live Monitoring' },
    { path: '/device-lock', icon: LockClosedIcon, label: 'Device Lock' },
    { path: '/stealer', icon: KeyIcon, label: 'Stealer C2' },
  ];

  const adminItems = [
    { path: '/admin', icon: ShieldCheckIcon, label: 'Admin Panel' },
    { path: '/admin/users', icon: UserGroupIcon, label: 'Kelola User' },
    { path: '/admin/devices', icon: DevicePhoneMobileIcon, label: 'Kelola Device' },
    { path: '/admin/resellers', icon: UserGroupIcon, label: 'Daftar Reseller' },
  ];

  const allItems = isAdmin ? [...menuItems, ...adminItems] : menuItems;

  const navigateTo = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600/20 p-2 rounded-lg">
              <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Menu</h2>
              <p className="text-gray-400 text-xs">Monitoring System</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {allItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigateTo(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
