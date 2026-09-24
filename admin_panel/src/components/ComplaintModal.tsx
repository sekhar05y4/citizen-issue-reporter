import React, { useState } from 'react';
import type { Complaint, Department, User, ComplaintStatus, ComplaintPriority } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { api, getUploadsUrl } from '../services/api';
import { X, MapPin, Calendar, User as UserIcon, Phone, Mail, Building, CheckCircle2 } from 'lucide-react';

interface Props {
  complaint: Complaint;
  departments: Department[];
  officers: User[];
  onClose: () => void;
  onRefresh: () => void;
}

export const ComplaintModal: React.FC<Props> = ({ complaint, departments, officers, onClose, onRefresh }) => {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [remarks, setRemarks] = useState('');
  const [departmentId, setDepartmentId] = useState<number | undefined>(complaint.assigned_department_id);
  const [officerId, setOfficerId] = useState<number | undefined>(complaint.assigned_officer_id);
  const [priority, setPriority] = useState<ComplaintPriority>(complaint.priority);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      await api.updateStatus(complaint.id, status, remarks, 'Municipal Admin');
      await api.assignComplaint(complaint.id, {
        department_id: departmentId,
        officer_id: officerId,
        priority: priority,
      });
      setFeedbackMsg('Complaint triage and status saved successfully!');
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 1000);
    } catch (e) {
      alert('Failed to update complaint: ' + e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500">{complaint.complaint_number}</span>
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mt-1">{complaint.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {feedbackMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {feedbackMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="space-y-2">
              <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Citizen Info</h3>
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <UserIcon className="w-4 h-4 text-emerald-600" />
                {complaint.citizen_name || 'Citizen'}
              </div>
              {complaint.citizen_email && (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Mail className="w-3.5 h-3.5" />
                  {complaint.citizen_email}
                </div>
              )}
              {complaint.citizen_phone && (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Phone className="w-3.5 h-3.5" />
                  {complaint.citizen_phone}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">Incident Location</h3>
              <div className="flex items-start gap-2 text-slate-800">
                <MapPin className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <span>{complaint.address || 'Address captured on GPS'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>Reported: {complaint.created_at ? new Date(complaint.created_at).toLocaleString() : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800">Description</h3>
            <p className="bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{complaint.description}</p>
          </div>

          {complaint.image_path && (
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800">Citizen Uploaded Evidence</h3>
              <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72 bg-black flex items-center justify-center">
                <img
                  src={`${getUploadsUrl()}/${complaint.image_path}`}
                  alt="Complaint Evidence"
                  className="max-h-72 object-contain w-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              Department Triage & Status Update
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Resolution Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assign Department</label>
                <select
                  value={departmentId || ''}
                  onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Unassigned</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Assign Officer</label>
                <select
                  value={officerId || ''}
                  onChange={(e) => setOfficerId(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Unassigned</option>
                  {officers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Official Remarks / Inspection Note</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter action taken, dispatch notes, or resolution confirmation for the citizen..."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {complaint.status_history && complaint.status_history.length > 0 && (
            <div className="border-t border-slate-200 pt-6 space-y-3">
              <h3 className="font-bold text-sm text-slate-800">Status History Audit Trail</h3>
              <div className="space-y-2">
                {complaint.status_history.map((h) => (
                  <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={h.status} />
                        <span className="font-semibold text-slate-700">{h.changed_by}</span>
                      </div>
                      {h.remarks && <p className="text-slate-600 mt-1 italic">"{h.remarks}"</p>}
                    </div>
                    <span className="text-slate-400">{new Date(h.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={handleUpdateStatus}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Apply & Save Triage'}
          </button>
        </div>
      </div>
    </div>
  );
};
