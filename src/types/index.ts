// eCoA Service CMS Types and Interfaces

export interface Request {
  id: string;
  message_id?: string; // Added message_id
  lot_id?: string;
  initiator_email: string;
  recipient_email: string;
  document_name: string;
  pdf_file?: string;
  xml_file?: string;
  supplier_information?: string;
  request_status: 'queued' | 'parsed' | 'parsing_failed' | 'error' | 'abandoned' | 'template_generated' | 'template_generation_failed';
  owner?: string;
  owner_status: 'unassigned' | 'assigned' | 'approved' | 'retried' | 'rejected';
  /**
   * @description Derived field: A high-level status aggregated from `request_status` and `owner_status` for display purposes.
   */
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  received_on?: string;
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
  id: number;
  part_id: number;
  template_code?: string;
  xml_file_path: string;
  created_at: string;
  updated_at: string;
  status: 'inactive' | 'active' | 'archived';
  hintl_enabled: boolean;
  description?: string;
  owners?: string[];
}

export type CreateTemplatePayload = Omit<Template, 'id' | 'created_at' | 'updated_at' | 'template_code' | 'description' | 'owners'>;
export type UpdateTemplatePayload = Partial<Omit<Template, 'id' | 'created_at' | 'template_code' | 'description' | 'owners'>>;

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
  role: 'Superuser' | 'Template Admin' | 'User';
}

export interface FilterOptions {
  request_status?: string[];
  owner_status?: string[];
  status?: string[];
  owner?: string[];
}