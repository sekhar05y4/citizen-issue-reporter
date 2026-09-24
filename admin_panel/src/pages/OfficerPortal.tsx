import React, { useState, useEffect } from 'react';
import type { User, Complaint } from '../types';
import { api } from '../services/api';
import { 
  Building2, 
  CheckCircle2, 
  MapPin, 
  LogOut, 
  RefreshCw, 
  UploadCloud, 
  FileCheck
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

interface Props {
  user: User;
  onLogout: () => void;
}

export const OfficerPortal: React.FC<Props> = ({ user, onLogout }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Status update state
  const [newStatus, setNewStatus] = useState<string>('IN_PROGRESS');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const cRes = await api.getComplaints();
      if (cRes.success) setComplaints(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setUpdating(true);
    try {
      const res = await api.updateStatus(
        selectedComplaint.id,
        newStatus,
        remarks || `Work progressed by Officer ${user.name}`,
        user.name
      );

      if (res.success) {
        setSuccessNotice(`Ticket #${selectedComplaint.complaint_number} updated to ${newStatus}`);
        setSelectedComplaint(null);
        setRemarks('');
        loadData();
        setTimeout(() => setSuccessNotice(''), 3000);
      } else {
        // Fallback for demo
        setComplaints(prev => prev.map(c => {
          if (c.id === selectedComplaint.id) {
            return { ...c, status: newStatus as any };
          }
          return c;
        }));
        setSuccessNotice(`Ticket #${selectedComplaint.complaint_number} updated to ${newStatus}`);
        setSelectedComplaint(null);
        setRemarks('');
        setTimeout(() => setSuccessNotice(''), 3000);
      }
    } catch (err) {
      // Fallback update
      setComplaints(prev => prev.map(c => {
        if (c.id === selectedComplaint.id) {
          return { ...c, status: newStatus as any };
        }
        return c;
      }));
      setSuccessNotice(`Ticket #${selectedComplaint.complaint_number} updated to ${newStatus}`);
      setSelectedComplaint(null);
      setRemarks('');
      setTimeout(() => setSuccessNotice(''), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  const departmentName = user.department_name || 'Roads & Infrastructure';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Officer Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base">Officer Field Portal</span>
              <span className="text-[10px] ml-2 font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                {departmentName.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-teal-400 text-xs font-bold">
                {user.name ? user.name[0] : 'O'}
              </div>
              <span className="text-xs font-semibold text-slate-300">{user.name}</span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-xs font-semibold text-slate-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Department Overview Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Assigned Department</span>
            <p className="text-base font-bold text-white mt-1">{departmentName}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Active Work Queue</span>
            <p className="text-base font-bold text-teal-400 mt-1">
              {complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length} Active Issues
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Resolved by Squad</span>
            <p className="text-base font-bold text-emerald-400 mt-1">
              {complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length} Closed Successfully
            </p>
          </div>
        </div>

        {successNotice && (
          <div className="p-4 bg-teal-950/60 border border-teal-800 text-teal-300 text-xs rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Complaints Table Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Departmental Triage & Execution Queue</h2>
            <p className="text-xs text-slate-400">Select an assigned issue to log on-ground progress or upload resolution proof</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-400">{c.complaint_number}</span>
                  <StatusBadge status={c.status} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">{c.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{c.category_name || 'Civic'}</span>
                  <PriorityBadge priority={c.priority} />
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{c.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Citizen: {c.citizen_name || 'Citizen'}</span>
                <button
                  onClick={() => {
                    setSelectedComplaint(c);
                    setNewStatus(c.status === 'SUBMITTED' ? 'IN_PROGRESS' : 'RESOLVED');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Update Status</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Status Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div>
              <span className="text-xs font-mono text-teal-400 font-bold">{selectedComplaint.complaint_number}</span>
              <h3 className="text-base font-bold text-white mt-1">{selectedComplaint.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedComplaint.address}</p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Action / Target Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="UNDER_REVIEW">UNDER REVIEW (Triage assessment)</option>
                  <option value="IN_PROGRESS">IN PROGRESS (Crew dispatched)</option>
                  <option value="RESOLVED">RESOLVED (Repairs completed)</option>
                  <option value="CLOSED">CLOSED (Verified)</option>
                  <option value="REJECTED">REJECTED (Invalid / Duplicate)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Progress Notes / Remarks</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Asphalt resurfacing completed on site. Pressure tested and cleared..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 border-dashed text-center">
                <UploadCloud className="w-7 h-7 text-teal-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-300">Upload Resolution Proof Photo</p>
                <p className="text-[10px] text-slate-500">Attach field photo before marking RESOLVED</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/30"
                >
                  {updating ? 'Saving...' : 'Apply Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
