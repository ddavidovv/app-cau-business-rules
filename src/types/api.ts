// ==================== BUSINESS CONTEXT TYPES ====================

export interface AssignmentCondition {
  field: string;
  operator: 'contains' | 'equals' | 'regex';
  value: string;
  weight: number;
}

export interface AssignmentRules {
  conditions?: AssignmentCondition[];
  defaultAssignee?: string;
  priorityThreshold?: number;
  // Nuevos campos para IA mejorada
  responsible_person: string;
  affected_systems: string[];
  default_priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CriticalityHints {
  highPriorityKeywords: string[];
  escalationKeywords: string[];
  businessHoursOnly: boolean;
}

export interface BusinessContext {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  alias: string[];
  projectManager: string;
  assignmentRules: AssignmentRules;
  criticalityHints: CriticalityHints;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface BusinessContextCreate {
  name: string;
  description: string;
  keywords: string[];
  alias: string[];
  projectManager: string;
  assignmentRules: AssignmentRules;
  criticalityHints: CriticalityHints;
  createdBy: string;
}

export interface BusinessContextUpdate {
  name?: string;
  description?: string;
  keywords?: string[];
  alias?: string[];
  projectManager?: string;
  assignmentRules?: AssignmentRules;
  criticalityHints?: CriticalityHints;
  isActive?: boolean;
  updatedBy: string;
}

// ==================== RESPONSIBLE TYPES ====================

export interface Responsible {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResponsibleCreate {
  name: string;
  email: string;
}

export interface ResponsibleUpdate {
  name?: string;
  email?: string;
}

// ==================== SYSTEM TYPES ====================

export interface System {
  id: string;
  name: string;
  description?: string;
  category?: string;
  owner?: string;
  environment: string;
  criticality_level: 'low' | 'medium' | 'high' | 'critical';
  monitoring_url?: string;
  documentation_url?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  incidentCount: number;
}

export interface SystemCreate {
  name: string;
  description?: string;
  category?: string;
  owner?: string;
  environment: string;
  criticality_level: 'low' | 'medium' | 'high' | 'critical';
  monitoring_url?: string;
  documentation_url?: string;
  tags: string[];
}

export interface SystemUpdate {
  name?: string;
  description?: string;
  category?: string;
  owner?: string;
  environment?: string;
  criticality_level?: 'low' | 'medium' | 'high' | 'critical';
  monitoring_url?: string;
  documentation_url?: string;
  tags?: string[];
  isActive?: boolean;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
}

// ==================== FORM TYPES ====================

export interface FormErrors {
  [key: string]: string[];
}

export interface LoadingStates {
  [key: string]: boolean;
}