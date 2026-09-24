import React from 'react';
import type { DashboardStats } from '../types';
import { Download, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface Props {
  stats: DashboardStats | null;
}

export const ReportsPage: React.FC<Props> = ({ stats }) => {
  const handleExportCSV = () => {
    alert('Exporting monthly municipal redressal audit report as CSV...');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Civic Redressal Analytics & SLA Report</h2>
          <p className="text-xs text-slate-500">Performance metrics and municipal resolution efficiency</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
        >
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <TrendingUp className="w-4 h-4" /> Average Resolution Time
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">2.4 Days</p>
          <p className="text-xs text-emerald-600 mt-1">Well within 5-day municipal SLA standard</p>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
            <CheckCircle className="w-4 h-4" /> Resolution Rate
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-2">
            {stats && stats.total_complaints > 0 ? Math.round((stats.resolved / stats.total_complaints) * 100) : 0}%
          </p>
          <p className="text-xs text-blue-600 mt-1">Grievances resolved and confirmed</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
            <Clock className="w-4 h-4" /> First-Response SLA
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-2">4.2 Hours</p>
          <p className="text-xs text-purple-600 mt-1">Average time to review & assign department</p>
        </div>
      </div>
    </div>
  );
};
