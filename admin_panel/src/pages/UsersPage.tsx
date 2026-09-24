import React, { useEffect, useState } from 'react';
import type { User } from '../types';
import { api } from '../services/api';
import { Users, ShieldAlert, Building2, User as UserIcon, CheckCircle2 } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [citizens, setCitizens] = useState<User[]>([]);
  const [officers, setOfficers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CITIZEN' | 'OFFICER' | 'ADMIN'>('ALL');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [cRes, oRes] = await Promise.all([api.getUsers(), api.getOfficers()]);
        if (cRes.success) setCitizens(cRes.data);
        if (oRes.success) setOfficers(oRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Combine users for unified directory
  const allUsers: (User & { status: string })[] = [
    ...officers.map(o => ({ ...o, status: 'Active' })),
    ...citizens.map(c => ({ ...c, role: 'CITIZEN' as const, status: 'Active' }))
  ];

  const filteredUsers = allUsers.filter(u => {
    if (roleFilter === 'ALL') return true;
    return u.role === roleFilter;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldAlert className="w-3 h-3" />
            <span>ADMIN</span>
          </span>
        );
      case 'OFFICER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <Building2 className="w-3 h-3" />
            <span>OFFICER</span>
          </span>
        );
      case 'CITIZEN':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserIcon className="w-3 h-3" />
            <span>CITIZEN</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" /> Citizens & Staff Directory
            </h2>
            <p className="text-xs text-slate-500">Comprehensive municipal user registry with role-based segregation</p>
          </div>

          <div className="flex items-center gap-2">
            {(['ALL', 'ADMIN', 'OFFICER', 'CITIZEN'] as const).map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  roleFilter === role
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 font-semibold">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u, idx) => (
                <tr key={`${u.id}-${u.role}-${idx}`} className="hover:bg-slate-50/50">
                  <td className="py-3 font-semibold text-slate-800">{u.name}</td>
                  <td className="py-3 text-slate-500 text-xs font-mono">{u.email}</td>
                  <td className="py-3">{getRoleBadge(u.role)}</td>
                  <td className="py-3 text-slate-600 text-xs">
                    {u.department_name || (u.role === 'ADMIN' ? 'Municipal Administration' : '—')}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
