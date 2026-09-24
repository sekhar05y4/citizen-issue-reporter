import React, { useEffect, useState } from 'react';
import type { User } from '../types';
import { api } from '../services/api';
import { Users, Shield } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [citizens, setCitizens] = useState<User[]>([]);
  const [officers, setOfficers] = useState<User[]>([]);

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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" /> Municipal Staff & Officers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 font-semibold">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {officers.map((o) => (
                <tr key={o.id}>
                  <td className="py-3 font-semibold text-slate-800">{o.name}</td>
                  <td className="py-3 text-slate-500 text-xs">{o.email}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">
                      {o.role}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 text-xs">{o.department_name || 'Central Administration'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" /> Registered Citizens ({citizens.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 font-semibold">
                <th className="pb-3">Citizen Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {citizens.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 font-semibold text-slate-800">{c.name}</td>
                  <td className="py-3 text-slate-500 text-xs">{c.email}</td>
                  <td className="py-3 text-slate-500 text-xs">{c.phone || '—'}</td>
                  <td className="py-3 text-slate-400 text-xs">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
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
