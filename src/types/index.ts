// eCoA Service CMS Types and Interfaces

export interface Request {
  id: string;
  initiator_email: string;
  recipient_email: string;
  document_name: string;
  pdf_file?: string;
  xml_file?: string;
  request_status: 'queued' | 'parsed' | 'parsing_failed' | 'error' | 'abandoned' | 'template_generated' | 'template_generation_failed';
  owner?: string;
  owner_status: 'unassigned' | 'assigned' | 'approved' | 'retried' | 'rejected';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  request_status_logs: StatusLog[];
  owner_status_logs?: StatusLog[];
  status_logs?: StatusLog[];
  parent_id?: string;
  children?: Request[];
}

export interface StatusLog {
  status: string;
  timestamp: string;
  user?: string;
  notes?: string;
}

export interface Template {
  id: string;
  part_no: string;
  xml_file: string;
  created_at: string;
  status: 'inactive' | 'active' | 'archived' | 'deleted';
}

export interface DashboardMetrics {
  totalRequests: number;
  statusCounts: {
    [key: string]: number;
  };
  recentActivity: Request[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'reviewer' | 'user';
}

export interface FilterOptions {
  request_status?: string[];
  owner_status?: string[];
  status?: string[];
  owner?: string[];
}