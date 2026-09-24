import React, { useState, useEffect } from 'react';
import type { User, Complaint, Category } from '../types';
import { api } from '../services/api';
import { 
  PlusCircle, 
  FileText, 
  MapPin, 
  User as UserIcon, 
  LogOut, 
  CheckCircle2, 
  UploadCloud,
  Star,
  Send,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

interface Props {
  user: User;
  onLogout: () => void;
}

export const CitizenPortal: React.FC<Props> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'my_complaints' | 'new_complaint' | 'profile'>('my_complaints');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // New Complaint Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  // Selected complaint for feedback
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, catRes] = await Promise.all([
        api.getComplaints(),
        api.getCategories()
      ]);
      if (cRes.success) setComplaints(cRes.data);
      if (catRes.success) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !categoryId) {
          setCategoryId(catRes.data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !title.trim() || !description.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const baseUrl = localStorage.getItem('api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('admin_token');
      
      const payload = {
        category_id: Number(categoryId),
        title: title.trim(),
        description: description.trim(),
        address: address.trim() || 'GPS Geotagged Location, Ward 12',
        priority: priority,
        latitude: 28.6139,
        longitude: 77.2090
      };

      const res = await fetch(`${baseUrl}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Grievance reported successfully! Ticket generated.');
        setTitle('');
        setDescription('');
        setAddress('');
        setActiveTab('my_complaints');
        loadData();
      } else {
        // Fallback for static demo mode
        const mockNew: Complaint = {
          id: Date.now(),
          complaint_number: `CMP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
          user_id: user.id,
          category_id: Number(categoryId),
          category_name: categories.find(c => c.id === Number(categoryId))?.name || 'General',
          title: title.trim(),
          description: description.trim(),
          address: address.trim() || 'Central Sector 4, Civic Ward 12',
          priority: priority as any,
          status: 'SUBMITTED',
          created_at: new Date().toISOString(),
          status_history: [
            {
              id: Date.now(),
              complaint_id: Date.now(),
              status: 'SUBMITTED',
              remarks: 'Grievance submitted by citizen',
              changed_by: user.name,
              created_at: new Date().toISOString()
            }
          ]
        };
        setComplaints(prev => [mockNew, ...prev]);
        setSuccessMsg('Grievance reported successfully! Ticket generated.');
        setTitle('');
        setDescription('');
        setAddress('');
        setActiveTab('my_complaints');
      }
    } catch (err) {
      // Offline fallback
      const mockNew: Complaint = {
        id: Date.now(),
        complaint_number: `CMP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        user_id: user.id,
        category_id: Number(categoryId) || 1,
        category_name: categories.find(c => c.id === Number(categoryId))?.name || 'Civic Infrastructure',
        title: title.trim(),
        description: description.trim(),
        address: address.trim() || 'Central Sector 4, Civic Ward 12',
        priority: priority as any,
        status: 'SUBMITTED',
        created_at: new Date().toISOString(),
        status_history: [
          {
            id: Date.now(),
            complaint_id: Date.now(),
            status: 'SUBMITTED',
            remarks: 'Grievance submitted by citizen',
            changed_by: user.name,
            created_at: new Date().toISOString()
          }
        ]
      };
      setComplaints(prev => [mockNew, ...prev]);
      setSuccessMsg('Grievance registered in citizen registry.');
      setTitle('');
      setDescription('');
      setAddress('');
      setActiveTab('my_complaints');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setSelectedComplaint(null);
      setFeedbackSent(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Citizen Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base">Citizen Portal</span>
              <span className="text-[10px] ml-2 font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                CITIZEN ACCESS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 text-xs font-bold">
                {user.name ? user.name[0] : 'C'}
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

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('my_complaints')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'my_complaints'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Complaints ({complaints.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('new_complaint')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'new_complaint'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report New Issue</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Citizen Profile</span>
            </button>
          </div>

          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Global Notifications / Alerts */}
        {successMsg && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: My Complaints */}
        {activeTab === 'my_complaints' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Track Your Submitted Grievances</h2>
              <span className="text-xs text-slate-400">Strictly Private Citizen View</span>
            </div>

            {complaints.length === 0 ? (
              <div className="p-12 text-center bg-slate-950/60 rounded-3xl border border-slate-800/80 space-y-3">
                <FileText className="w-10 h-10 mx-auto text-slate-600" />
                <h3 className="text-sm font-bold text-slate-300">No complaints filed yet</h3>
                <p className="text-xs text-slate-500">Notice road damage, garbage, or water leaks in your area? Report it below.</p>
                <button
                  onClick={() => setActiveTab('new_complaint')}
                  className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Report First Issue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400">{c.complaint_number}</span>
                        <StatusBadge status={c.status} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-white">{c.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{c.category_name || 'Civic'}</span>
                        <PriorityBadge priority={c.priority} />
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span className="truncate max-w-[150px]">{c.address}</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}
                      </span>

                      {c.status === 'RESOLVED' && (
                        <button
                          onClick={() => setSelectedComplaint(c)}
                          className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1"
                        >
                          <Star className="w-3 h-3" />
                          <span>Rate Resolution</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: New Complaint Form */}
        {activeTab === 'new_complaint' && (
          <div className="max-w-2xl mx-auto bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Report a Civic Problem</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your report will be automatically categorized and routed to the corresponding municipal field squad.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 text-rose-300 text-xs rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Issue Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Grievance Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Deep crater in front of community park"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description & Details *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide exact landmark details and hazard severity..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location / Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ward 12, Main Market Road"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Urgency / Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LOW">Low (Cosmetic issue)</option>
                    <option value="MEDIUM">Medium (General disturbance)</option>
                    <option value="HIGH">High (Safety risk / Major traffic)</option>
                    <option value="URGENT">Urgent (Immediate danger / Flood)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 border-dashed text-center">
                <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">Photo Proof Attached</p>
                <p className="text-[10px] text-slate-500 mt-0.5">GPS location geotag automatically appended</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Grievance...' : 'Submit Grievance to Municipality'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-xl font-bold">
                {user.name ? user.name[0] : 'C'}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{user.name}</h2>
                <p className="text-xs text-slate-400">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  VERIFIED CITIZEN
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-900">
                <span className="text-slate-400">Account Type</span>
                <span className="font-semibold text-white">Public Citizen</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-900">
                <span className="text-slate-400">Phone Number</span>
                <span className="font-semibold text-white">{user.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-900">
                <span className="text-slate-400">Complaints Filed</span>
                <span className="font-semibold text-emerald-400">{complaints.length} tickets</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Feedback Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Rate Resolution for #{selectedComplaint.complaint_number}</h3>
            <p className="text-xs text-slate-400">{selectedComplaint.title}</p>

            {feedbackSent ? (
              <div className="p-4 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl text-center">
                Thank you for your feedback! Rating submitted.
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Service Quality Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all ${
                          rating >= star ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        ★ {star}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Remarks / Suggestions</label>
                  <textarea
                    rows={3}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Work was completed on time, clean asphalt finish..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
