import { apiGet } from './api';
import {
  AIAccuracyMetrics,
  SystemsValidationStats,
  AIDashboardData,
  CommonMistake,
  AIMetricsConfig
} from '../types/ai';
import { ApiResponse } from '../types';

// Servicio para gestión de métricas y análisis de IA
export class AIService {
  private basePath = '/api/ai';

  // Obtener métricas de precisión de la IA
  async getAccuracyMetrics(daysBack: number = 7): Promise<AIAccuracyMetrics> {
    const endpoint = `${this.basePath}/accuracy-metrics?days_back=${daysBack}`;
    return apiGet<AIAccuracyMetrics>(endpoint);
  }

  // Obtener estadísticas de validación de sistemas
  async getSystemsValidationStats(): Promise<SystemsValidationStats> {
    return apiGet<SystemsValidationStats>(`${this.basePath}/systems-validation-stats`);
  }

  // Obtener información completa del dashboard de IA
  async getDashboardData(daysBack: number = 7): Promise<AIDashboardData> {
    try {
      const [accuracyMetrics, validationStats] = await Promise.all([
        this.getAccuracyMetrics(daysBack),
        this.getSystemsValidationStats()
      ]);

      // Calcular tendencias
      const trends = this.calculateTrends(accuracyMetrics, validationStats);

      return {
        accuracy_metrics: accuracyMetrics,
        validation_stats: validationStats,
        trends
      };
    } catch (error) {
      throw new Error(`Error obteniendo datos del dashboard: ${error}`);
    }
  }

  // Obtener errores frecuentes de la IA
  async getCommonMistakes(daysBack: number = 30): Promise<CommonMistake[]> {
    const metrics = await this.getAccuracyMetrics(daysBack);
    return metrics.common_mistakes || [];
  }

  // Generar reporte de mejoras sugeridas
  async getImprovementReport(daysBack: number = 30): Promise<{
    summary: string;
    critical_issues: string[];
    recommendations: string[];
    systems_to_review: string[];
  }> {
    try {
      const [accuracyMetrics, validationStats] = await Promise.all([
        this.getAccuracyMetrics(daysBack),
        this.getSystemsValidationStats()
      ]);

      const criticalIssues = [];
      const recommendations = [];
      const systemsToReview = [];

      // Analizar precisión
      if (accuracyMetrics.accuracy_percentage < 80) {
        criticalIssues.push(`Precisión baja: ${accuracyMetrics.accuracy_percentage}%`);
        recommendations.push('Revisar y actualizar el business context');
      }

      // Analizar sistemas problemáticos
      const problematicSystems = validationStats.most_problematic_systems
        .filter(system => system.error_percentage > 10);

      if (problematicSystems.length > 0) {
        criticalIssues.push(`${problematicSystems.length} sistemas con alta tasa de error`);
        systemsToReview.push(...problematicSystems.map(s => s.system_name));
        recommendations.push('Revisar nomenclatura de sistemas problemáticos');
      }

      // Analizar errores frecuentes
      const frequentErrors = accuracyMetrics.common_mistakes?.filter(m => m.frequency > 5) || [];
      if (frequentErrors.length > 3) {
        criticalIssues.push(`${frequentErrors.length} errores muy frecuentes detectados`);
        recommendations.push('Actualizar catálogo de sistemas para incluir variaciones comunes');
      }

      const summary = criticalIssues.length > 0
        ? `Se detectaron ${criticalIssues.length} problemas que requieren atención`
        : 'El sistema de IA está funcionando dentro de parámetros normales';

      return {
        summary,
        critical_issues: criticalIssues,
        recommendations: [...recommendations, ...validationStats.improvement_suggestions],
        systems_to_review: systemsToReview
      };

    } catch (error) {
      throw new Error(`Error generando reporte de mejoras: ${error}`);
    }
  }

  // Validar configuración de métricas
  validateMetricsConfig(config: AIMetricsConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.days_back < 1 || config.days_back > 90) {
      errors.push('El período debe estar entre 1 y 90 días');
    }

    if (config.refresh_interval_minutes < 5 || config.refresh_interval_minutes > 1440) {
      errors.push('El intervalo de actualización debe estar entre 5 minutos y 24 horas');
    }

    if (config.accuracy_threshold < 50 || config.accuracy_threshold > 100) {
      errors.push('El umbral de precisión debe estar entre 50% y 100%');
    }

    if (config.error_threshold < 0 || config.error_threshold > 50) {
      errors.push('El umbral de errores debe estar entre 0% y 50%');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Calcular tendencias basadas en métricas actuales
  private calculateTrends(
    accuracyMetrics: AIAccuracyMetrics,
    validationStats: SystemsValidationStats
  ) {
    // Análisis simple de tendencias (en producción se compararía con datos históricos)
    let accuracy_trend: 'improving' | 'stable' | 'declining' | 'insufficient_data' = 'insufficient_data';

    if (accuracyMetrics.total_classifications > 50) {
      if (accuracyMetrics.accuracy_percentage >= 90) {
        accuracy_trend = 'stable';
      } else if (accuracyMetrics.accuracy_percentage >= 80) {
        accuracy_trend = 'improving';
      } else {
        accuracy_trend = 'declining';
      }
    }

    const avgDailyClassifications = Math.round(
      accuracyMetrics.total_classifications / accuracyMetrics.period_days
    );

    return {
      accuracy_trend,
      total_corrections_last_week: accuracyMetrics.total_corrections,
      avg_daily_classifications: avgDailyClassifications
    };
  }

  // Exportar datos para análisis externo
  async exportMetricsToCSV(daysBack: number = 30): Promise<Blob> {
    try {
      const data = await this.getDashboardData(daysBack);

      const csvContent = this.convertMetricsToCSV(data);

      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    } catch (error) {
      throw new Error(`Error exportando métricas: ${error}`);
    }
  }

  private convertMetricsToCSV(data: AIDashboardData): string {
    const headers = [
      'Fecha Análisis',
      'Período (días)',
      'Total Clasificaciones',
      'Total Correcciones',
      'Precisión (%)',
      'Tendencia',
      'Sistemas Problemáticos'
    ];

    const rows = [
      headers.join(','),
      [
        data.accuracy_metrics.analysis_date.split('T')[0],
        data.accuracy_metrics.period_days,
        data.accuracy_metrics.total_classifications,
        data.accuracy_metrics.total_corrections,
        data.accuracy_metrics.accuracy_percentage,
        data.trends.accuracy_trend,
        data.validation_stats.most_problematic_systems.length
      ].join(',')
    ];

    // Agregar errores frecuentes
    if (data.accuracy_metrics.common_mistakes?.length > 0) {
      rows.push('');
      rows.push('Errores Frecuentes:');
      rows.push('Sistema Incorrecto,Sistema Correcto,Frecuencia');

      data.accuracy_metrics.common_mistakes.forEach(mistake => {
        rows.push(`"${mistake.wrong}","${mistake.correct}",${mistake.frequency}`);
      });
    }

    return rows.join('\n');
  }
}

// Instancia singleton del servicio
export const aiService = new AIService();