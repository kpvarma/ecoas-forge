// eCoA Service CMS Types and Interfaces

export interface Request {
  id: string;
  lot_id?: string;
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
  email?: string;
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
  updated_at: string; // Made mandatory
  status: 'inactive' | 'active';
  plant_id: string;
  hintl_enabled: boolean; // Made mandatory
  description?: string; // Added for template form
  owners?: string[];
}

export type CreateTemplatePayload = Omit<Template, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTemplatePayload = Partial<Omit<Template, 'id' | 'created_at'>>;

export interface Responsibility {
  id: string;
  user: User;
  part_number: string;
  plant_id: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export type CreateResponsibilityPayload = Omit<Responsibility, 'id' | 'created_at' | 'updated_at'>;
export type UpdateResponsibilityPayload = Partial<Omit<Responsibility, 'id' | 'created_at'>>;

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