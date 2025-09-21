// Tipos para gestión de Sistemas
export interface System {
  _id?: string;
  id?: string;
  system_name: string;
  description?: string;
  category?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

// Datos para crear/editar sistemas
export interface CreateSystemData {
  system_name: string;
  description?: string;
  category?: string;
  active?: boolean;
}

export interface UpdateSystemData extends CreateSystemData {
  updated_by: string;
}

// Categorías de sistemas disponibles
export type SystemCategory =
  | 'Core Business'
  | 'Support Tools'
  | 'Infrastructure'
  | 'Communication'
  | 'Security'
  | 'Analytics'
  | 'Other';

// Estadísticas de sistemas
export interface SystemStats {
  total_systems: number;
  active_systems: number;
  inactive_systems: number;
  systems_with_rules: number;
  systems_without_rules: number;
  systems_by_category: Record<SystemCategory, number>;
  recent_activity: SystemActivity[];
}

export interface SystemActivity {
  action: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated';
  system_name: string;
  user: string;
  timestamp: string;
}

// Información extendida de sistema
export interface SystemWithStats extends System {
  assigned_rules_count: number;
  assigned_tickets_count?: number;
  last_activity?: string;
}