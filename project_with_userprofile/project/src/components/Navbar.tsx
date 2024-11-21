import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Apple, Camera, Receipt, ClipboardList, History, LogIn } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', icon: Apple, label: 'Home' },
    { path: '/label-scanning', icon: Receipt, label: 'Label Scan' },
    { path: '/plate-scanning', icon: Camera, label: 'Plate Scan' },
    { path: '/manual-entry', icon: ClipboardList, label: 'Manual Entry' },
    { path: '/history', icon: History, label: 'History' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Apple className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-800">NutriScan</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive(path)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;