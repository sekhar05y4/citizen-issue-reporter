import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { MapPage } from './pages/MapPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { UsersPage } from './pages/UsersPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { ComplaintModal } from './components/ComplaintModal';
import type { User, Complaint, Category, Department, DashboardStats } from './types';
import { api } from './services/api';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [officers, setOfficers] = useState<User[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    const cachedUser = localStorage.getItem('admin_user');
    if (cachedUser) {
      try {
        setCurrentUser(JSON.parse(cachedUser));
      } catch (_) {}
    }
  }, []);

  const loadData = async () => {
    try {
      const [sRes, cRes, catRes, dRes, oRes] = await Promise.all([
        api.getDashboardStats(),
        api.getComplaints(),
        api.getCategories(),
        api.getDepartments(),
        api.getOfficers(),
      ]);

      if (sRes.success) setStats(sRes.data);
      if (cRes.success) setComplaints(cRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (dRes.success) setDepartments(dRes.data);
      if (oRes.success) setOfficers(oRes.data);
    } catch (err) {
      console.error('Data load error', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h1>
            <p className="text-xs text-slate-500 font-medium">Municipal Grievance Redressal Command Center</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              System Online
            </span>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <DashboardPage
            stats={stats}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
            onViewAllComplaints={() => setActiveTab('complaints')}
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintsPage
            complaints={complaints}
            categories={categories}
            departments={departments}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'map' && (
          <MapPage
            complaints={complaints}
            onSelectComplaint={(c) => setSelectedComplaint(c)}
          />
        )}

        {activeTab === 'departments' && (
          <DepartmentsPage departments={departments} onRefresh={loadData} />
        )}

        {activeTab === 'users' && <UsersPage />}

        {activeTab === 'feedback' && <FeedbackPage />}

        {activeTab === 'reports' && <ReportsPage stats={stats} />}

        {activeTab === 'settings' && <SettingsPage />}

        {selectedComplaint && (
          <ComplaintModal
            complaint={selectedComplaint}
            departments={departments}
            officers={officers}
            onClose={() => setSelectedComplaint(null)}
            onRefresh={loadData}
          />
        )}
      </main>
    </div>
  );
}

export default App;
