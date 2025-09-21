import React, { useState, useEffect } from 'react';
import { Settings, Plus, AlertCircle, Edit2, Trash2, User, Tag, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui';
import BusinessContextForm from '../components/forms/BusinessContextForm';
import { BusinessContext, BusinessContextCreate, BusinessContextUpdate } from '../types/api';
import { useToast } from '../hooks/useToast';

const BusinessContextPage: React.FC = () => {
  const [businessContexts, setBusinessContexts] = useState<BusinessContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContext, setEditingContext] = useState<BusinessContext | undefined>();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchBusinessContexts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/business-context', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform API response to match our BusinessContext interface
      const transformedContexts: BusinessContext[] = (data || []).map((ctx: any) => {
        const transformed = {
          id: ctx.id,
          name: ctx.name,
          description: ctx.description,
          keywords: ctx.keywords || [],
          alias: ctx.alias || [],
          projectManager: ctx.project_manager || ctx.projectManager,
          assignmentRules: {
            responsible_person: ctx.assignment_rules?.responsible_person || ctx.assignmentRules?.responsible_person || '',
            affected_systems: ctx.assignment_rules?.affected_systems || ctx.assignmentRules?.affected_systems || [],
            default_priority: ctx.assignment_rules?.default_priority || ctx.assignmentRules?.default_priority || 'MEDIUM'
          },
          criticalityHints: ctx.criticality_hints || ctx.criticalityHints,
          isActive: ctx.is_active !== false,
          createdAt: ctx.created_at || '',
          updatedAt: ctx.updated_at || '',
          updatedBy: ctx.updated_by || 'system',
        };
        return transformed;
      });

      setBusinessContexts(transformedContexts);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      showToast('Error al cargar reglas de negocio', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessContexts();
  }, []);

  const handleCreateContext = async (data: BusinessContextCreate) => {
    try {
      const payload = {
        ...data,
        project_manager: data.projectManager,
        created_by: 'admin@cttexpress.com', // TODO: Get from auth context
      };

      console.log('DEBUG Page - Payload a enviar:', payload);
      console.log('DEBUG Page - assignment_rules del payload:', payload.assignment_rules);

      const response = await fetch('http://localhost:5000/api/admin/business-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear regla de negocio');
      }

      showToast('Regla de negocio creada exitosamente', 'success');
      fetchBusinessContexts();
    } catch (error) {
      console.error('Error creating business context:', error);
      showToast(error instanceof Error ? error.message : 'Error al crear regla de negocio', 'error');
      throw error;
    }
  };

  const handleUpdateContext = async (data: BusinessContextUpdate) => {
    if (!editingContext) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/business-context/${editingContext.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          project_manager: data.projectManager,
          updated_by: 'admin@cttexpress.com', // TODO: Get from auth context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar regla de negocio');
      }

      showToast('Regla de negocio actualizada exitosamente', 'success');
      fetchBusinessContexts();
    } catch (error) {
      console.error('Error updating business context:', error);
      showToast(error instanceof Error ? error.message : 'Error al actualizar regla de negocio', 'error');
      throw error;
    }
  };

  const handleDeleteContext = async (contextId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta regla de negocio? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setIsDeleting(contextId);
      const response = await fetch(`http://localhost:5000/api/admin/business-context/${contextId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al eliminar regla de negocio');
      }

      showToast('Regla de negocio eliminada exitosamente', 'success');
      fetchBusinessContexts();
    } catch (error) {
      console.error('Error deleting business context:', error);
      showToast(error instanceof Error ? error.message : 'Error al eliminar regla de negocio', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const openCreateForm = () => {
    setEditingContext(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (context: BusinessContext) => {
    setEditingContext(context);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingContext(undefined);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reglas de Negocio</h1>
            <p className="text-gray-600 mt-1">
              Gestione los contextos de negocio para la clasificación inteligente con IA
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reglas de negocio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reglas de Negocio</h1>
            <p className="text-gray-600 mt-1">
              Gestione los contextos de negocio para la clasificación inteligente con IA
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar reglas</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchBusinessContexts}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reglas de Negocio</h1>
          <p className="text-gray-600 mt-1">
            Gestione los contextos de negocio para la clasificación inteligente con IA
          </p>
        </div>
        <Button variant="primary" onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Regla
        </Button>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">¿Cómo funcionan las Reglas de Negocio?</h3>
            <p className="text-sm text-blue-800">
              La IA analiza cada ticket y busca las palabras clave definidas en estas reglas.
              Cuando encuentra una coincidencia, asigna automáticamente el ticket al responsable
              configurado y aplica el contexto de negocio apropiado.
            </p>
          </div>
        </div>
      </div>

      {/* Business Contexts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Reglas Configuradas ({businessContexts.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Contextos de negocio para clasificación automática con IA
          </p>
        </div>

        {businessContexts.length === 0 ? (
          <div className="p-12 text-center">
            <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay reglas de negocio configuradas
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Comience creando reglas para que la IA pueda clasificar automáticamente
              los tickets según el contexto de negocio.
            </p>
            <Button variant="primary" onClick={openCreateForm}>
              <Plus className="h-4 w-4 mr-2" />
              Crear primera regla
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {businessContexts.map((context) => (
              <div key={context.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <Settings className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {context.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${context.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {context.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>

                      {context.description && (
                        <p className="text-sm text-gray-600 mb-3">{context.description}</p>
                      )}

                      <div className="space-y-2">
                        {/* Keywords */}
                        <div className="flex items-start space-x-2">
                          <Tag className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Palabras Clave:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {context.keywords.map((keyword, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Alias */}
                        {context.alias && context.alias.length > 0 && (
                          <div className="flex items-start space-x-2">
                            <Tag className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Términos Alternativos:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {context.alias.map((alias, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                    {alias}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Project Manager */}
                        {context.projectManager && (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Responsable:</span>
                            <span className="text-sm text-gray-700">{context.projectManager}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(context)}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteContext(context.id)}
                      disabled={isDeleting === context.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {isDeleting === context.id ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Business Context Form Modal */}
      <BusinessContextForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingContext ? handleUpdateContext : handleCreateContext}
        businessContext={editingContext}
        title={editingContext ? 'Editar Regla de Negocio' : 'Crear Nueva Regla de Negocio'}
        submitText={editingContext ? 'Actualizar' : 'Crear'}
      />
    </div>
  );
};

export default BusinessContextPage;