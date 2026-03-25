import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  // This will later use real auth state
  const isAuthenticated = true;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
        TaskFlow
      </Link>
      
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
              U
            </div>
          </div>
          <Button variant="ghost" size="sm">Logout</Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
