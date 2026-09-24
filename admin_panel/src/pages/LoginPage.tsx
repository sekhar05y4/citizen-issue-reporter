import React, { useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { 
  LogIn, 
  ArrowLeft, 
  User as UserIcon, 
  Building2, 
  ShieldAlert,
  Sparkles,
  KeyRound,
  Mail,
  Lock
} from 'lucide-react';

interface Props {
  initialRole?: UserRole;
  onLoginSuccess: (user: User, token: string) => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<Props> = ({ 
  initialRole = 'ADMIN', 
  onLoginSuccess, 
  onBackToHome 
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('admin@demo.local');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update email and password when switching role
  useEffect(() => {
    if (selectedRole === 'CITIZEN') {
      setEmail('citizen@demo.local');
      setPassword('Citizen@123');
    } else if (selectedRole === 'OFFICER') {
      setEmail('officer@demo.local');
      setPassword('Officer@123');
    } else {
      setEmail('admin@demo.local');
      setPassword('Admin@123');
    }
    setError('');
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    try {
      const baseUrl = localStorage.getItem('api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPass,
          expected_role: selectedRole
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        localStorage.setItem('admin_token', data.data.access_token);
        localStorage.setItem('admin_user', JSON.stringify(data.data.user));
        onLoginSuccess(data.data.user, data.data.access_token);
        return;
      } else {
        setError(data.message || 'Invalid email or password.');
        setLoading(false);
        return;
      }
    } catch (err) {
      // Static / Offline GitHub Pages Demo Validation
      // 1. Citizen Portal
      if (selectedRole === 'CITIZEN') {
        if (trimmedEmail === 'citizen@demo.local' && (trimmedPass === 'Citizen@123' || trimmedPass === 'DemoPass123!')) {
          const mockCitizen: User = {
            id: 3,
            name: 'Rahul Sharma (Verified Citizen)',
            email: 'citizen@demo.local',
            phone: '+91 98765 43210',
            role: 'CITIZEN',
          };
          localStorage.setItem('admin_token', 'mock_citizen_token');
          localStorage.setItem('admin_user', JSON.stringify(mockCitizen));
          onLoginSuccess(mockCitizen, 'mock_citizen_token');
          return;
        } else if (
          trimmedEmail === 'officer@demo.local' || 
          trimmedEmail === 'admin@demo.local' || 
          trimmedEmail.includes('officer') || 
          trimmedEmail.includes('admin')
        ) {
          setError('These credentials are not authorized for the selected portal.');
          setLoading(false);
          return;
        } else {
          setError('Invalid email or password.');
          setLoading(false);
          return;
        }
      }

      // 2. Officer Portal
      if (selectedRole === 'OFFICER') {
        if (trimmedEmail === 'officer@demo.local' && (trimmedPass === 'Officer@123' || trimmedPass === 'DemoPass123!')) {
          const mockOfficer: User = {
            id: 2,
            name: 'Er. Rajesh Kumar (Roads & Traffic Officer)',
            email: 'officer@demo.local',
            phone: '+91 98765 11223',
            role: 'OFFICER',
            department_id: 1,
            department_name: 'Roads & Infrastructure',
          };
          localStorage.setItem('admin_token', 'mock_officer_token');
          localStorage.setItem('admin_user', JSON.stringify(mockOfficer));
          onLoginSuccess(mockOfficer, 'mock_officer_token');
          return;
        } else if (
          trimmedEmail === 'citizen@demo.local' || 
          trimmedEmail === 'admin@demo.local' || 
          trimmedEmail.includes('citizen') || 
          trimmedEmail.includes('admin')
        ) {
          setError('These credentials are not authorized for the selected portal.');
          setLoading(false);
          return;
        } else {
          setError('Invalid email or password.');
          setLoading(false);
          return;
        }
      }

      // 3. Admin Command Center
      if (selectedRole === 'ADMIN') {
        if (trimmedEmail === 'admin@demo.local' && (trimmedPass === 'Admin@123' || trimmedPass === 'DemoPass123!')) {
          const mockAdmin: User = {
            id: 1,
            name: 'Dr. Anita Verma (Chief Municipal Officer)',
            email: 'admin@demo.local',
            phone: '+91 98765 00001',
            role: 'ADMIN',
            department_name: 'Municipal Administration',
          };
          localStorage.setItem('admin_token', 'mock_admin_token');
          localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
          onLoginSuccess(mockAdmin, 'mock_admin_token');
          return;
        } else if (
          trimmedEmail === 'citizen@demo.local' || 
          trimmedEmail === 'officer@demo.local' || 
          trimmedEmail.includes('citizen') || 
          trimmedEmail.includes('officer')
        ) {
          setError('These credentials are not authorized for the selected portal.');
          setLoading(false);
          return;
        } else {
          setError('Invalid email or password.');
          setLoading(false);
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleTheme = () => {
    switch (selectedRole) {
      case 'CITIZEN':
        return {
          title: 'CITIZEN LOGIN',
          subtitle: 'Access your civic complaint portal',
          color: 'emerald',
          accentBg: 'bg-emerald-600 hover:bg-emerald-700',
          shadow: 'shadow-emerald-600/30',
          icon: UserIcon,
          demoEmail: 'citizen@demo.local',
          demoPass: 'Citizen@123'
        };
      case 'OFFICER':
        return {
          title: 'OFFICER LOGIN',
          subtitle: 'Access your field operations portal',
          color: 'teal',
          accentBg: 'bg-teal-600 hover:bg-teal-700',
          shadow: 'shadow-teal-600/30',
          icon: Building2,
          demoEmail: 'officer@demo.local',
          demoPass: 'Officer@123'
        };
      case 'ADMIN':
      default:
        return {
          title: 'ADMINISTRATOR LOGIN',
          subtitle: 'Access the municipal command center',
          color: 'cyan',
          accentBg: 'bg-emerald-600 hover:bg-emerald-700',
          shadow: 'shadow-emerald-600/30',
          icon: ShieldAlert,
          demoEmail: 'admin@demo.local',
          demoPass: 'Admin@123'
        };
    }
  };

  const theme = getRoleTheme();
  const HeaderIcon = theme.icon;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-emerald-500 selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Back to landing button */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between z-10">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <span className="text-[11px] font-medium text-slate-500">Citizen Issue Reporter</span>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 sm:p-8 max-w-md w-full shadow-2xl relative z-10 space-y-6 backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-13 h-13 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <HeaderIcon className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">{theme.title}</h1>
          <p className="text-xs text-slate-400 font-medium italic">{theme.subtitle}</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setSelectedRole('CITIZEN')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'CITIZEN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Citizen</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('OFFICER')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'OFFICER'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Officer</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('ADMIN')}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'ADMIN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-950/70 border border-rose-800 text-rose-300 text-xs rounded-xl font-semibold flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Pre-fill Notice */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Demo Dev Account:</span>
          </div>
          <span className="font-mono text-emerald-400 text-[11px] font-semibold">
            {theme.demoEmail}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@demo.local"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 ${theme.accentBg} text-white font-bold rounded-xl shadow-lg ${theme.shadow} transition-all text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]`}
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Verifying Credentials...' : `Sign In to ${selectedRole === 'ADMIN' ? 'Admin Center' : selectedRole === 'OFFICER' ? 'Officer Portal' : 'Citizen Portal'}`}
          </button>
        </form>
      </div>
    </div>
  );
};
