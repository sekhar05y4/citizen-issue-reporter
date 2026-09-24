import React, { useState } from 'react';
import type { Complaint, Category, Department } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Search, RefreshCw, Eye } from 'lucide-react';

interface Props {
  complaints: Complaint[];
  categories: Category[];
  departments: Department[];
  onSelectComplaint: (c: Complaint) => void;
  onRefresh: () => void;
}

export const ComplaintsPage: React.FC<Props> = ({
  complaints,
  categories,
  onSelectComplaint,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filtered = complaints.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint_number.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchCategory = categoryFilter === 'ALL' || c.category_id.toString() === categoryFilter;
    const matchPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;

    return matchSearch && matchStatus && matchCategory && matchPriority;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search CMP#, title, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <button
            onClick={onRefresh}
            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <th className="pb-3">Complaint ID</th>
              <th className="pb-3">Grievance Title & Location</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Department</th>
              <th className="pb-3">Priority</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Filed On</th>
              <th className="pb-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No grievances found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-mono text-xs font-bold text-slate-700">{c.complaint_number}</td>
                  <td className="py-3">
                    <p className="font-semibold text-slate-800">{c.title}</p>
                    <p className="text-xs text-slate-500 truncate max-w-sm">{c.address}</p>
                  </td>
                  <td className="py-3 text-xs font-medium text-slate-600">{c.category_name}</td>
                  <td className="py-3 text-xs text-slate-600">{c.department_name || '—'}</td>
                  <td className="py-3"><PriorityBadge priority={c.priority} /></td>
                  <td className="py-3"><StatusBadge status={c.status} /></td>
                  <td className="py-3 text-xs text-slate-400">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectComplaint(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Triage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
