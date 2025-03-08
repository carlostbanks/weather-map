// src/components/Header.tsx
import React, { useEffect } from 'react';
import { User } from '../types';
import { logout } from '../services/auth';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  useEffect(() => {
    console.log("Header component mounted/updated");
    console.log("Header received user:", user);
  }, [user]);

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout();
    console.log("Logout service called");
    onLogout();
    console.log("onLogout callback executed");
    window.location.href = '/login';
  };

  // Debug render
  console.log("Header rendering with user:", user);
  console.log("User is null?", user === null);
  console.log("User is undefined?", user === undefined);
  
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold">GeoExplorer</a>
            
            {user && (
              <nav className="ml-10">
                <ul className="flex space-x-6">
                  <li>
                    <a href="/" className="hover:text-blue-200">Home</a>
                  </li>
                  <li>
                    <a href="/dashboard" className="hover:text-blue-200">Dashboard</a>
                  </li>
                </ul>
              </nav>
            )}
          </div>
          
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user.username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <a 
                  href="/login" 
                  className="bg-white text-blue-600 px-3 py-1 rounded text-sm"
                >
                  Login
                </a>
                <a 
                  href="/register"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm border border-blue-200"
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;