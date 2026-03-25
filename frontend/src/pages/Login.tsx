import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.accessToken, response.data.refreshToken);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-2">TaskFlow</h1>
      </div>
      <div className="max-w-md w-full glass-card p-10 rounded-3xl relative overflow-hidden shadow-2xl shadow-primary-900/5">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Sign in to manage your tasks efficiently</p>
          </div>
          
          {error && <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-700 text-sm font-semibold rounded-xl border border-red-100 flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          
          <div className="flex items-center justify-end">
            <a href="#" className="text-sm text-primary-600 hover:text-primary-500 font-medium">Forgot password?</a>
          </div>
          
          <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors">
            Sign up here
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};
