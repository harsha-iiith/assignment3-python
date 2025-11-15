import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { logoutUser } from '../store/slices/userSlice';
import { LogOut, User, Menu, X, BookOpen } from 'lucide-react';
import { resetUserDetails } from '../reducers/user';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(resetUserDetails).unwrap();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/signin');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Default avatar if none provided
  const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}&background=6366f1&color=fff`;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section - Project Logo/Name */}
          <div 
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={handleLogoClick}
          >
            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">VidyaVichar</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Learning Management System</p>
            </div>
          </div>

          {/* Right Section - User Info & Logout */}
          <div className="flex items-center space-x-4">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop User Section */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={avatarUrl}
                  alt={user.name || user.email}
                  className="w-8 h-8 rounded-full border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'User')}&background=6366f1&color=fff`;
                  }}
                />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={avatarUrl}
                  alt={user.name || user.email}
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || 'User')}&background=6366f1&color=fff`;
                  }}
                />
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role || 'Student'}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;