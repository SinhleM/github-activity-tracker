import React, { useState } from 'react';
import { Github, Menu, X, BarChart3, Home, Settings, User } from 'lucide-react';

const Header = ({ currentPath = '/' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Statistics', href: '/stats', icon: BarChart3 },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isCurrentPath = (path) => {
    return currentPath === path;
  };

  const handleNavClick = (href) => {
    // This would integrate with your routing system
    console.log(`Navigate to: ${href}`);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavClick('/')} 
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
                <Github className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">GitHub Tracker</h1>
                <p className="text-xs text-gray-500">Activity Dashboard</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isCurrentPath(item.href)
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Avatar */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900">Developer</p>
                <p className="text-xs text-gray-500">GitHub User</p>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isCurrentPath(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
              
              {/* Mobile User Section */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-900">Developer</div>
                    <div className="text-sm text-gray-500">GitHub User</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optional: Breadcrumb for current page */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-2">
            <Home className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">/</span>
            <span className="text-sm font-medium text-gray-900">
              {navigation.find(item => isCurrentPath(item.href))?.name || 'Dashboard'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;