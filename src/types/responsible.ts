// Tipos para gestión de Responsables
export interface Responsible {
  _id?: string;
  id?: string;
  responsible_email: string;
  name?: string;
  department?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Datos para crear/editar responsables
export interface CreateResponsibleData {
  responsible_email: string;
  name?: string;
  department?: string;
  active?: boolean;
}

export interface UpdateResponsibleData extends CreateResponsibleData {
  updated_by: string;
}

// Estadísticas de responsables
export interface ResponsibleStats {
  total_responsibles: number;
  active_responsibles: number;
  inactive_responsibles: number;
  responsibles_with_rules: number;
  responsibles_without_rules: number;
  recent_activity: ResponsibleActivity[];
}

export interface ResponsibleActivity {
  action: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated';
  responsible_email: string;
  user: string;
  timestamp: string;
}

// Información extendida de responsable
export interface ResponsibleWithStats extends Responsible {
  assigned_rules_count: number;
  assigned_tickets_count?: number;
  last_activity?: string;
}