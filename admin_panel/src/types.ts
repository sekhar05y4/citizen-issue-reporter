export type UserRole = 'CITIZEN' | 'ADMIN' | 'OFFICER';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ComplaintStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department_id?: number;
  department_name?: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface StatusHistory {
  id: number;
  complaint_id: number;
  status: string;
  remarks?: string;
  changed_by: string;
  created_at: string;
}

export interface Feedback {
  id: number;
  complaint_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Complaint {
  id: number;
  complaint_number: string;
  user_id: number;
  citizen_name?: string;
  citizen_email?: string;
  citizen_phone?: string;
  category_id: number;
  category_name?: string;
  category_icon?: string;
  title: string;
  description: string;
  latitude?: number;
  longitude?: number;
  address: string;
  image_path?: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assigned_department_id?: number;
  department_name?: string;
  assigned_officer_id?: number;
  assigned_officer_name?: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  status_history?: StatusHistory[];
  feedback?: Feedback;
}

export interface DashboardStats {
  total_complaints: number;
  submitted: number;
  under_review: number;
  assigned: number;
  in_progress: number;
  resolved: number;
  closed: number;
  rejected: number;
  total_citizens: number;
  total_departments: number;
  category_breakdown: {
    id: number;
    name: string;
    icon: string;
    count: number;
  }[];
  recent_complaints: Complaint[];
}
