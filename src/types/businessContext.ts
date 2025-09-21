import { Priority, RequestType } from './common';

// Tipos para Business Context (Reglas de Negocio)
export interface ProjectManager {
  name: string;
  azure_user: string;
}

export interface AssignmentRules {
  responsible_person: string;
  affected_systems: string[];
  default_priority: Priority;
}

export interface CriticalityHints {
  high: string[];
  medium: string[];
  low: string[];
}

export interface BusinessContext {
  _id?: string;
  id?: string;
  keywords: string[];
  alias: string[];
  project_manager: ProjectManager;
  assignment_rules: AssignmentRules;
  criticality_hints: CriticalityHints;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  description?: string;
  name?: string;
}

// Datos para crear/editar Business Context
export interface CreateBusinessContextData {
  keywords: string[];
  alias: string[];
  project_manager: ProjectManager;
  assignment_rules: AssignmentRules;
  criticality_hints: CriticalityHints;
  description?: string;
  name?: string;
}

export interface UpdateBusinessContextData extends CreateBusinessContextData {
  updated_by: string;
}

// Preview de clasificación de IA
export interface ClassificationPreview {
  ticket_type: RequestType;
  priority: Priority;
  responsible_person: string;
  affected_systems: string[];
  confidence_score: number;
  reasoning: string;
}

// Validación de conflictos
export interface ValidationResult {
  valid: boolean;
  conflicts: ConflictIssue[];
  warnings: string[];
  suggestions: string[];
}

export interface ConflictIssue {
  type: 'keyword_overlap' | 'assignment_conflict' | 'missing_field';
  message: string;
  conflicting_rule_id?: string;
  severity: 'high' | 'medium' | 'low';
}

// Estadísticas de uso
export interface BusinessContextStats {
  total_rules: number;
  rules_with_conflicts: number;
  most_used_responsible: string;
  systems_coverage_percentage: number;
  avg_keywords_per_rule: number;
  recent_activity: BusinessContextActivity[];
}

export interface BusinessContextActivity {
  action: 'created' | 'updated' | 'deleted';
  rule_name: string;
  user: string;
  timestamp: string;
}

// Formulario con ayudas contextuales
export interface FormFieldConfig {
  field: string;
  label: string;
  description: string;
  placeholder?: string;
  help_text: string;
  example?: string;
  required: boolean;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'array';
  options?: string[];
}