import React, { useState, useEffect } from 'react';
import { Monitor, Plus, AlertCircle, Edit2, Trash2, ExternalLink, Globe, Settings } from 'lucide-react';
import { Button } from '../components/ui';
import SystemForm from '../components/forms/SystemForm';
import { System, SystemCreate, SystemUpdate } from '../types/api';
import { useToast } from '../hooks/useToast';

interface SystemFromAPI {
  id: string;
  system_name: string;
  name?: string;
  description?: string;
  category?: string;
  owner?: string;
  environment?: string;
  criticality_level?: 'low' | 'medium' | 'high' | 'critical';
  monitoring_url?: string;
  documentation_url?: string;
  tags?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  incident_count?: number;
}

const SystemsPage: React.FC = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<System | undefined>();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchSystems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/systems', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform API response to match our System interface
      const transformedSystems: System[] = (data.systems || []).map((sys: SystemFromAPI) => ({
        id: sys.id,
        name: sys.name || sys.system_name,
        description: sys.description,
        category: sys.category,
        owner: sys.owner,
        environment: sys.environment || 'production',
        criticality_level: sys.criticality_level || 'medium',
        monitoring_url: sys.monitoring_url,
        documentation_url: sys.documentation_url,
        tags: sys.tags || [],
        isActive: sys.is_active !== false,
        createdAt: sys.created_at || '',
        updatedAt: sys.updated_at || '',
        incidentCount: sys.incident_count || 0,
      }));

      setSystems(transformedSystems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      showToast('Error al cargar sistemas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  const handleCreateSystem = async (data: SystemCreate) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/systems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear sistema');
      }

      showToast('Sistema creado exitosamente', 'success');
      fetchSystems();
    } catch (error) {
      console.error('Error creating system:', error);
      showToast(error instanceof Error ? error.message : 'Error al crear sistema', 'error');
      throw error;
    }
  };

  const handleUpdateSystem = async (data: SystemUpdate) => {
    if (!editingSystem) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/systems/${editingSystem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar sistema');
      }

      showToast('Sistema actualizado exitosamente', 'success');
      fetchSystems();
    } catch (error) {
      console.error('Error updating system:', error);
      showToast(error instanceof Error ? error.message : 'Error al actualizar sistema', 'error');
      throw error;
    }
  };

  const handleDeleteSystem = async (systemId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este sistema? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setIsDeleting(systemId);
      const response = await fetch(`http://localhost:5000/api/admin/systems/${systemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al eliminar sistema');
      }

      showToast('Sistema eliminado exitosamente', 'success');
      fetchSystems();
    } catch (error) {
      console.error('Error deleting system:', error);
      showToast(error instanceof Error ? error.message : 'Error al eliminar sistema', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const openCreateForm = () => {
    setEditingSystem(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (system: System) => {
    setEditingSystem(system);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingSystem(undefined);
  };

  const getCriticalityColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityText = (level: string) => {
    switch (level) {
      case 'low': return 'Bajo';
      case 'medium': return 'Medio';
      case 'high': return 'Alto';
      case 'critical': return 'Crítico';
      default: return level;
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production': return 'bg-red-100 text-red-800';
      case 'staging': return 'bg-yellow-100 text-yellow-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      case 'development': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnvironmentText = (env: string) => {
    switch (env) {
      case 'production': return 'Producción';
      case 'staging': return 'Staging';
      case 'testing': return 'Testing';
      case 'development': return 'Desarrollo';
      default: return env;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistemas</h1>
            <p className="text-gray-600 mt-1">
              Gestione los sistemas y aplicaciones para el contexto de clasificación
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando sistemas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistemas</h1>
            <p className="text-gray-600 mt-1">
              Gestione los sistemas y aplicaciones para el contexto de clasificación
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar sistemas</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchSystems}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistemas</h1>
          <p className="text-gray-600 mt-1">
            Gestione los sistemas y aplicaciones para el contexto de clasificación
          </p>
        </div>
        <Button variant="primary" onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Sistema
        </Button>
      </div>

      {/* Systems List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Sistemas Registrados ({systems.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Sistemas y aplicaciones disponibles para clasificación automática
          </p>
        </div>

        {systems.length === 0 ? (
          <div className="p-12 text-center">
            <Monitor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay sistemas registrados
            </h3>
            <p className="text-gray-600 mb-6">
              Comience agregando sistemas para la clasificación automática
            </p>
            <Button variant="primary" onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar primer sistema
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {systems.map((system) => (
              <div key={system.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <Monitor className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {system.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCriticalityColor(system.criticality_level)}`}>
                          {getCriticalityText(system.criticality_level)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getEnvironmentColor(system.environment)}`}>
                          {getEnvironmentText(system.environment)}
                        </span>
                      </div>

                      {system.description && (
                        <p className="text-sm text-gray-600 mb-2">{system.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {system.category && (
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-1" />
                            <span>{system.category}</span>
                          </div>
                        )}
                        {system.owner && (
                          <div className="flex items-center">
                            <span>👤 {system.owner}</span>
                          </div>
                        )}
                        {system.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {system.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {tag}
                              </span>
                            ))}
                            {system.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{system.tags.length - 3} más</span>
                            )}
                          </div>
                        )}
                      </div>

                      {(system.monitoring_url || system.documentation_url) && (
                        <div className="flex items-center space-x-4 mt-3">
                          {system.monitoring_url && (
                            <a
                              href={system.monitoring_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              Monitoreo
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                          {system.documentation_url && (
                            <a
                              href={system.documentation_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                              Documentación
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${system.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {system.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(system)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSystem(system.id)}
                      disabled={isDeleting === system.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {isDeleting === system.id ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Form Modal */}
      <SystemForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingSystem ? handleUpdateSystem : handleCreateSystem}
        system={editingSystem}
        title={editingSystem ? 'Editar Sistema' : 'Crear Nuevo Sistema'}
        submitText={editingSystem ? 'Actualizar' : 'Crear'}
      />
    </div>
  );
};

export default SystemsPage;