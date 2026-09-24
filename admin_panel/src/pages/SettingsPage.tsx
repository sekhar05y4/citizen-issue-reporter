import React, { useState } from 'react';
import { Settings } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [url, setUrl] = useState(
    localStorage.getItem('api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('api_base_url', url.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 max-w-2xl">
      <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
        <Settings className="w-4 h-4 text-emerald-600" /> Admin Portal Configuration
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Backend REST API URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost:5000/api"
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
          {saved && <p className="text-xs text-emerald-600 font-semibold mt-1">API Base URL saved!</p>}
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
          <p className="font-bold text-slate-700">Demo Credentials:</p>
          <p>• Admin: admin@demo.local / DemoPass123!</p>
          <p>• Officer: officer@demo.local / DemoPass123!</p>
          <p>• Citizen: citizen@demo.local / DemoPass123!</p>
        </div>
      </div>
    </div>
  );
};
