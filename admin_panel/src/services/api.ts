import type { Complaint, DashboardStats, Category, Department, User, Feedback } from '../types';

const getBaseUrl = () => {
  return localStorage.getItem('api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

export const getUploadsUrl = () => {
  const base = getBaseUrl();
  return base.replace('/api', '/uploads');
};

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${getBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${getBaseUrl()}/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getDashboardStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    const res = await fetch(`${getBaseUrl()}/admin/dashboard`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getComplaints: async (params?: Record<string, string>): Promise<{ success: boolean; data: Complaint[] }> => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${getBaseUrl()}/admin/complaints?${query}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getComplaintDetail: async (id: number): Promise<{ success: boolean; data: Complaint }> => {
    const res = await fetch(`${getBaseUrl()}/complaints/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  updateStatus: async (id: number, status: string, remarks: string, changedBy: string) => {
    const res = await fetch(`${getBaseUrl()}/admin/complaints/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, remarks, changed_by: changedBy }),
    });
    return res.json();
  },

  assignComplaint: async (id: number, data: { department_id?: number; officer_id?: number; priority?: string }) => {
    const res = await fetch(`${getBaseUrl()}/admin/complaints/${id}/assign`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getCategories: async (): Promise<{ success: boolean; data: Category[] }> => {
    const res = await fetch(`${getBaseUrl()}/categories`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getDepartments: async (): Promise<{ success: boolean; data: Department[] }> => {
    const res = await fetch(`${getBaseUrl()}/admin/departments`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  createDepartment: async (name: string, description: string) => {
    const res = await fetch(`${getBaseUrl()}/admin/departments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, description }),
    });
    return res.json();
  },

  getOfficers: async (): Promise<{ success: boolean; data: User[] }> => {
    const res = await fetch(`${getBaseUrl()}/admin/officers`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getUsers: async (): Promise<{ success: boolean; data: User[] }> => {
    const res = await fetch(`${getBaseUrl()}/admin/users`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  getFeedback: async (): Promise<{ success: boolean; data: Feedback[] }> => {
    const res = await fetch(`${getBaseUrl()}/feedback`, {
      headers: getHeaders(),
    });
    return res.json();
  },
};
