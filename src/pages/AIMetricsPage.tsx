import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Download } from 'lucide-react';
import { Button } from '../components/ui';
import { aiService } from '../services/aiService';
import { AIDashboardData, AIAccuracyMetrics, SystemsValidationStats } from '../types/ai';

const AIMetricsPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AIDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysBack, setDaysBack] = useState(7);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
  }, [daysBack]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await aiService.getDashboardData(daysBack);
      setDashboardData(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError('Error cargando métricas de IA');
      console.error('Error loading AI dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await aiService.exportMetricsToCSV(daysBack);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-metrics-${daysBack}days-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting metrics:', error);
    }
  };

  const getAccuracyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: string;
    trend?: string;
  }> = ({ title, value, subtitle, icon, color = 'text-gray-600', trend }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end space-y-1">
          {icon && <div className="text-gray-400">{icon}</div>}
          {trend && <div>{getTrendIcon(trend)}</div>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Error cargando métricas</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={loadDashboardData} variant="outline">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { accuracy_metrics, validation_stats, trends } = dashboardData;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Métricas de IA</h1>
            <p className="text-gray-600">
              Monitoreo de precisión y rendimiento del sistema de clasificación automática
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Selector de período */}
            <select
              value={daysBack}
              onChange={(e) => setDaysBack(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Último día</option>
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={90}>Últimos 90 días</option>
            </select>

            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>

            <Button onClick={loadDashboardData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Precisión Global"
            value={`${accuracy_metrics.accuracy_percentage}%`}
            subtitle={`${accuracy_metrics.total_classifications} clasificaciones`}
            color={getAccuracyColor(accuracy_metrics.accuracy_percentage)}
            trend={trends.accuracy_trend}
          />

          <MetricCard
            title="Sistemas Corregidos"
            value={accuracy_metrics.total_corrections}
            subtitle="Correcciones automáticas"
            color={accuracy_metrics.total_corrections === 0 ? 'text-green-600' : 'text-yellow-600'}
          />

          <MetricCard
            title="Promedio Diario"
            value={trends.avg_daily_classifications}
            subtitle="Clasificaciones por día"
            color="text-blue-600"
          />

          <MetricCard
            title="Tasa de Éxito"
            value={`${validation_stats.validation_summary.success_rate_percentage}%`}
            subtitle="Validaciones exitosas"
            color={getAccuracyColor(validation_stats.validation_summary.success_rate_percentage)}
          />
        </div>

        {/* Información detallada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Errores frecuentes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Errores Más Frecuentes</h3>
            {accuracy_metrics.common_mistakes && accuracy_metrics.common_mistakes.length > 0 ? (
              <div className="space-y-3">
                {accuracy_metrics.common_mistakes.slice(0, 5).map((mistake, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-900">
                        "{mistake.wrong}" → "{mistake.correct}"
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {mistake.frequency}x
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No se detectaron errores frecuentes en el período seleccionado
              </p>
            )}
          </div>

          {/* Sistemas problemáticos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sistemas Más Problemáticos</h3>
            {validation_stats.most_problematic_systems.length > 0 ? (
              <div className="space-y-3">
                {validation_stats.most_problematic_systems.slice(0, 5).map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">{system.system_name}</p>
                      <p className="text-xs text-yellow-700">{system.error_count} errores</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {system.error_percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No se detectaron sistemas problemáticos
              </p>
            )}
          </div>

          {/* Recomendaciones */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recomendaciones de Mejora</h3>
            {accuracy_metrics.recommendations && accuracy_metrics.recommendations.length > 0 ? (
              <div className="space-y-2">
                {accuracy_metrics.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <p className="text-sm text-blue-900">{recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                El sistema está funcionando de manera óptima
              </p>
            )}
          </div>
        </div>

        {/* Footer con información de actualización */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Última actualización: {lastRefresh.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default AIMetricsPage;