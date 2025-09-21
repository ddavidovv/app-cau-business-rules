import { apiGet } from './api';
import {
  DashboardData,
  OverviewStats,
  DashboardActivity,
  ChartData,
  SystemAlert
} from '../types';

// Servicio para datos del Dashboard
export class DashboardService {
  private basePath = '/api/admin/dashboard';

  // Obtener todos los datos del dashboard
  async getDashboardData(): Promise<DashboardData> {
    return apiGet<DashboardData>(this.basePath);
  }

  // Obtener estadísticas generales
  async getOverviewStats(): Promise<OverviewStats> {
    return apiGet<OverviewStats>(`${this.basePath}/overview`);
  }

  // Obtener actividad reciente
  async getRecentActivity(limit: number = 20): Promise<DashboardActivity[]> {
    return apiGet<DashboardActivity[]>(`${this.basePath}/activity?limit=${limit}`);
  }

  // Obtener datos para gráfico de distribución de reglas por responsable
  async getRulesDistributionChart(): Promise<ChartData> {
    return apiGet<ChartData>(`${this.basePath}/charts/rules-distribution`);
  }

  // Obtener datos para gráfico de sistemas más utilizados
  async getSystemsUsageChart(): Promise<ChartData> {
    return apiGet<ChartData>(`${this.basePath}/charts/systems-usage`);
  }

  // Obtener datos para gráfico de actividad por tiempo
  async getActivityTimelineChart(days: number = 30): Promise<ChartData> {
    return apiGet<ChartData>(`${this.basePath}/charts/activity-timeline?days=${days}`);
  }

  // Obtener alertas del sistema
  async getSystemAlerts(): Promise<SystemAlert[]> {
    return apiGet<SystemAlert[]>(`${this.basePath}/alerts`);
  }

  // Marcar alerta como resuelta
  async resolveAlert(alertId: string): Promise<{ success: boolean }> {
    return apiGet<{ success: boolean }>(`${this.basePath}/alerts/${alertId}/resolve`);
  }

  // Obtener métricas de rendimiento de la IA
  async getAIPerformanceMetrics(): Promise<{
    classification_accuracy: number;
    total_classifications: number;
    successful_assignments: number;
    failed_assignments: number;
    average_confidence: number;
    top_performing_rules: Array<{
      rule_name: string;
      success_rate: number;
      usage_count: number;
    }>;
    improvement_suggestions: string[];
  }> {
    return apiGet(`${this.basePath}/ai-performance`);
  }

  // Obtener estadísticas de uso por período
  async getUsageStatistics(period: 'day' | 'week' | 'month' | 'quarter' = 'month'): Promise<{
    total_rules_created: number;
    total_rules_updated: number;
    total_rules_deleted: number;
    active_users: number;
    most_active_user: string;
    busiest_day: string;
    peak_activity_hour: number;
  }> {
    return apiGet(`${this.basePath}/usage-stats?period=${period}`);
  }

  // Generar reporte completo del sistema
  async generateSystemReport(): Promise<Blob> {
    const response = await fetch(`${this.basePath}/generate-report`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al generar reporte del sistema');
    }

    return response.blob();
  }

  // Ejecutar diagnóstico del sistema
  async runSystemDiagnostic(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    checks: Array<{
      name: string;
      status: 'pass' | 'warn' | 'fail';
      message: string;
      details?: string;
    }>;
    recommendations: string[];
    last_run: string;
  }> {
    return apiGet(`${this.basePath}/diagnostic`);
  }

  // Obtener configuración del sistema
  async getSystemConfig(): Promise<{
    version: string;
    environment: string;
    database_status: 'connected' | 'disconnected';
    api_status: 'healthy' | 'degraded' | 'error';
    features_enabled: string[];
    maintenance_mode: boolean;
    last_backup: string;
  }> {
    return apiGet(`${this.basePath}/system-config`);
  }

  // Limpiar cache del sistema
  async clearSystemCache(): Promise<{ success: boolean; message: string }> {
    return apiGet(`${this.basePath}/clear-cache`);
  }
}

// Instancia singleton del servicio
export const dashboardService = new DashboardService();