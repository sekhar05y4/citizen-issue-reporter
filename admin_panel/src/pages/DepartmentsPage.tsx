import React, { useState } from 'react';
import type { Department } from '../types';
import { api } from '../services/api';
import { Building2, Plus, CheckCircle2 } from 'lucide-react';

interface Props {
  departments: Department[];
  onRefresh: () => void;
}

export const DepartmentsPage: React.FC<Props> = ({ departments, onRefresh }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await api.createDepartment(name.trim(), description.trim());
      setName('');
      setDescription('');
      setShowAdd(false);
      onRefresh();
    } catch (err) {
      alert('Error creating department: ' + err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Municipal Departments</h2>
          <p className="text-xs text-slate-500">Manage civic engineering and maintenance divisions</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-sm text-slate-800">New Department</h3>
          <input
            type="text"
            placeholder="Department Name (e.g. Bridges & Flyovers)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
            required
          />
          <input
            type="text"
            placeholder="Scope / Responsibility description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Department'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((d) => (
          <div key={d.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <Building2 className="w-4 h-4" />
              {d.name}
            </div>
            <p className="text-xs text-slate-500">{d.description || 'General municipal responsibility'}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Active Department
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
