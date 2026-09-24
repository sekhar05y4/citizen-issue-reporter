import React, { useState } from 'react';
import { api } from '../services/api';
import type { User } from '../types';
import { ShieldAlert, LogIn } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: User, token: string) => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@demo.local');
  const [password, setPassword] = useState('DemoPass123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(email.trim(), password.trim());
      if (res.success && res.data) {
        localStorage.setItem('admin_token', res.data.access_token);
        localStorage.setItem('admin_user', JSON.stringify(res.data.user));
        onLoginSuccess(res.data.user, res.data.access_token);
      } else {
        setError(res.message || 'Invalid staff credentials');
      }
    } catch (err) {
      if (email === 'admin@demo.local') {
        const mockAdmin: User = {
          id: 1,
          name: 'Dr. Anita Verma (Chief Municipal Officer)',
          email: 'admin@demo.local',
          role: 'ADMIN',
        };
        localStorage.setItem('admin_token', 'mock_admin_token');
        localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
        onLoginSuccess(mockAdmin, 'mock_admin_token');
      } else {
        setError('Server unavailable: ' + err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: 'ADMIN' | 'OFFICER') => {
    if (role === 'ADMIN') {
      setEmail('admin@demo.local');
      setPassword('DemoPass123!');
    } else {
      setEmail('officer@demo.local');
      setPassword('DemoPass123!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Citizen Reporter</h1>
          <p className="text-xs text-slate-500 font-medium">Municipal Staff & Officer Administration</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill('ADMIN')}
            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Demo Admin
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('OFFICER')}
            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Demo Officer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.local"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/25 transition-all text-sm flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};
