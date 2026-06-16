import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3 sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition lg:hidden"
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
          
          <div className="flex items-center space-x-2">
            {isAdmin && (
              <div className="bg-yellow-500/20 p-1.5 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5 text-yellow-400" />
              </div>
            )}
            <h1 className="text-xl font-bold text-white">Monitoring System</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition"
            >
              <div className="bg-blue-600/20 rounded-full p-1.5">
                <UserCircleIcon className="w-8 h-8 text-blue-400" />
              </div>
              <span className="hidden md:block text-sm">
                {user?.email?.split('@')[0] || 'User'}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-white font-medium">{user?.email || 'User'}</p>
                  {isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition flex items-center space-x-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
