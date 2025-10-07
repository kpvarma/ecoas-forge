// eCoA Service CMS Types and Interfaces

export interface Request {
  id: string;
  created_date:string;
  initiator_email: string;
  recipient_email: string;
  document_name: string;
  pdf_file?: string;
  xml_file?: string;
  request_status: 'queued' | 'parsed' | 'parsing_failed' | 'error' | 'abandoned' | 'template_generated' | 'template_generation_failed';
  owner?: string;
  owner_status: 'unassigned' | 'assigned' | 'approved' | 'retried' | 'rejected';
  /**
   * @description Derived field: A high-level status aggregated from `request_status` and `owner_status` for display purposes.
   */
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  request_status_logs: StatusLog[];
  owner_status_logs?: StatusLog[];
  /**
   * @description Derived field: Aggregated status logs, potentially combining `request_status_logs` and `owner_status_logs`.
   */
  status_logs?: StatusLog[];
  parent_id?: string;
  children?: Request[];
  plant_id?: string;
  part_number?: string;
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
  template_code?: string; // Added to align with mock data
  xml_file: string;
  created_at: string;
  updated_at?: string; // Added to align with schema
  status: 'inactive' | 'active' | 'archived' | 'deleted';
  plant_id?: string; // Added for template form
  hintl_enabled?: boolean; // Added for template form
  description?: string; // Added for template form
}

export type CreateTemplatePayload = Omit<Template, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTemplatePayload = Partial<Omit<Template, 'id' | 'created_at'>>;

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