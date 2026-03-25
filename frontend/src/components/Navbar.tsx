import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/60 transition-all">
      <Link to="/" className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm hover:opacity-80 transition-opacity">
        TaskFlow
      </Link>
      
      {isAuthenticated && user ? (
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-6 mr-2">
            <Link to="/" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">Dashboard</Link>
            <Link to="/analytics" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">Analytics</Link>
          </div>
          <div className="flex items-center gap-3 bg-white/50 py-1.5 px-3 rounded-full border border-white/60 shadow-sm backdrop-blur-sm">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold uppercase text-xs shadow-inner">
              {user.name.charAt(0)}
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block pr-1">{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-600 hover:bg-white/50 hover:text-red-500 font-semibold rounded-full px-4">
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="font-semibold text-slate-700 hover:bg-white/60 rounded-full px-5">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="rounded-full shadow-md shadow-primary-500/20 px-6 font-semibold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600">Get Started</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
