import React from 'react';
import type { DashboardStats, Complaint } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { FileText, Clock, CheckCircle, AlertTriangle, Users, Building, ArrowUpRight } from 'lucide-react';

interface Props {
  stats: DashboardStats | null;
  onSelectComplaint: (c: Complaint) => void;
  onViewAllComplaints: () => void;
}

export const DashboardPage: React.FC<Props> = ({ stats, onSelectComplaint, onViewAllComplaints }) => {
  if (!stats) {
    return <div className="p-8 text-center text-slate-500">Loading Dashboard Analytics...</div>;
  }

  const statCards = [
    { label: 'Total Grievances', value: stats.total_complaints, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Submitted / New', value: stats.submitted, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Under Repair', value: stats.in_progress, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Citizens Enrolled', value: stats.total_citizens, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Depts', value: stats.total_departments, icon: Building, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800 leading-tight">{card.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-1">
          <h2 className="text-base font-bold text-slate-800 mb-4">Grievance by Category</h2>
          <div className="space-y-3">
            {stats.category_breakdown.map((cat) => {
              const percentage = stats.total_complaints > 0 ? Math.round((cat.count / stats.total_complaints) * 100) : 0;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat.name}</span>
                    <span className="text-slate-500">{cat.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">Recent Grievances</h2>
              <button
                onClick={onViewAllComplaints}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                View all complaints <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 font-semibold">
                    <th className="pb-3">Complaint #</th>
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recent_complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-mono text-xs font-bold text-slate-600">{c.complaint_number}</td>
                      <td className="py-3 font-medium text-slate-800 max-w-xs truncate">{c.title}</td>
                      <td className="py-3 text-xs text-slate-500">{c.category_name}</td>
                      <td className="py-3"><PriorityBadge priority={c.priority} /></td>
                      <td className="py-3"><StatusBadge status={c.status} /></td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onSelectComplaint(c)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Triage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
