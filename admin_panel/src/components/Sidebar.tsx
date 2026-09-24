import React from 'react';
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Users,
  Building2,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { User } from '../types';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'complaints', label: 'Complaints', icon: FileText },
    { id: 'map', label: 'Incident Map', icon: MapPin },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'users', label: 'Citizens & Staff', icon: Users },
    { id: 'feedback', label: 'Feedback & Ratings', icon: MessageSquare },
    { id: 'reports', label: 'Analytics Reports', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 z-30 transition-[width] duration-200 ease-in-out select-none`}
    >
      {/* Brand Header & Collapse Toggle Button */}
      <div className={`p-4 border-b border-slate-100 flex items-center ${isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Citizen Reporter'}
          >
            <ShieldAlert className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-slate-800 text-base leading-tight truncate">Citizen Reporter</h1>
              <p className="text-xs text-slate-400 font-medium truncate">Municipal Admin Portal</p>
            </div>
          )}
        </div>

        {/* Toggle Collapse Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shrink-0"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              title={item.label}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'
              } py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Badge & Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2 justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0"
              title={currentUser?.name || 'Administrator'}
            >
              {currentUser?.name ? currentUser.name[0] : 'A'}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-800 truncate">{currentUser?.name || 'Administrator'}</p>
                <p className="text-[11px] text-emerald-600 font-medium capitalize">{currentUser?.role || 'ADMIN'}</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            aria-label="Sign Out"
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
