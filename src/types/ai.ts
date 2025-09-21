// Tipos para métricas y análisis de IA

export interface AICorrection {
  original: string;
  corrected: string;
  confidence: number;
  timestamp: string;
}

export interface CommonMistake {
  wrong: string;
  correct: string;
  frequency: number;
}

export interface AIAccuracyMetrics {
  total_classifications: number;
  total_corrections: number;
  accuracy_percentage: number;
  classifications_with_errors: number;
  most_problematic_systems: Array<[string, number]>;
  period_days: number;
  analysis_date: string;
  common_mistakes: CommonMistake[];
  recommendations: string[];
}

export interface ValidationSummary {
  period_days: number;
  total_validations: number;
  validations_with_corrections: number;
  success_rate_percentage: number;
}

export interface ProblematicSystem {
  system_name: string;
  error_count: number;
  error_percentage: number;
}

export interface SystemsValidationStats {
  validation_summary: ValidationSummary;
  most_problematic_systems: ProblematicSystem[];
  improvement_suggestions: string[];
}

// Métricas agregadas para dashboard
export interface AIDashboardData {
  accuracy_metrics: AIAccuracyMetrics;
  validation_stats: SystemsValidationStats;
  trends: {
    accuracy_trend: 'improving' | 'stable' | 'declining' | 'insufficient_data';
    total_corrections_last_week: number;
    avg_daily_classifications: number;
  };
}

// Configuración de métricas
export interface AIMetricsConfig {
  days_back: number;
  refresh_interval_minutes: number;
  accuracy_threshold: number; // Umbral de precisión esperado
  error_threshold: number;    // Umbral máximo de errores aceptables
}