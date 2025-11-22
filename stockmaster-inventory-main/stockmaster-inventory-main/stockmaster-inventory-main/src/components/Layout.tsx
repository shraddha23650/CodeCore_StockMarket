/**
 * Layout Component
 * Main layout with navigation
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-xl font-bold text-blue-600">
                StockMaster
              </Link>
              <div className="flex space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/products" className="text-gray-700 hover:text-blue-600">
                  Products
                </Link>
                <Link to="/receipts" className="text-gray-700 hover:text-blue-600">
                  Receipts
                </Link>
                <Link to="/deliveries" className="text-gray-700 hover:text-blue-600">
                  Deliveries
                </Link>
                <Link to="/transfers" className="text-gray-700 hover:text-blue-600">
                  Transfers
                </Link>
                <Link to="/adjustments" className="text-gray-700 hover:text-blue-600">
                  Adjustments
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-sm text-gray-600">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;

