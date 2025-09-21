import { BusinessContextStats } from './businessContext';
import { ResponsibleStats } from './responsible';
import { SystemStats } from './system';

// Tipos para el Dashboard administrativo
export interface DashboardData {
  business_context: BusinessContextStats;
  responsibles: ResponsibleStats;
  systems: SystemStats;
  overview: OverviewStats;
  recent_activity: DashboardActivity[];
}

export interface OverviewStats {
  total_entities: number;
  active_rules: number;
  pending_validations: number;
  last_sync: string;
  system_health: 'healthy' | 'warning' | 'error';
  ai_classification_accuracy: number;
}

export interface DashboardActivity {
  id: string;
  type: 'business_context' | 'responsible' | 'system';
  action: 'created' | 'updated' | 'deleted' | 'validated';
  entity_name: string;
  user: string;
  timestamp: string;
  details?: string;
}

// Métricas para gráficos
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
}

// Alertas del sistema
export interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  action_required?: boolean;
  action_text?: string;
  action_url?: string;
}