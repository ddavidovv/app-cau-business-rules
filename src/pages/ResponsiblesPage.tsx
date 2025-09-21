import React, { useEffect, useState } from 'react';
import { Users, Plus, Mail, User, Edit3, Trash2, Phone, Clock, Hash } from 'lucide-react';
import { Button, FormModal, ConfirmDialog } from '../components/ui';
import { ResponsibleForm } from '../components/forms/ResponsibleForm';
import { responsiblesService } from '../services/responsibles';
import { Responsible, ResponsibleCreate, ResponsibleUpdate } from '../types/api';

interface ModalState {
  isOpen: boolean;
  type: 'create' | 'edit';
  responsible?: Responsible;
}

interface DeleteState {
  isOpen: boolean;
  responsible?: Responsible;
}

const ResponsiblesPage: React.FC = () => {
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ isOpen: false, type: 'create' });
  const [deleteState, setDeleteState] = useState<DeleteState>({ isOpen: false });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchResponsibles = async () => {
    try {
      setLoading(true);
      const data = await responsiblesService.getAll();
      setResponsibles(data.responsibles || []);
    } catch (error) {
      console.error('Error fetching responsibles:', error);
      // Ensure we always have an array even on error
      setResponsibles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponsibles();
  }, []);

  const handleCreateClick = () => {
    setModal({ isOpen: true, type: 'create' });
  };

  const handleEditClick = (responsible: Responsible) => {
    setModal({ isOpen: true, type: 'edit', responsible });
  };

  const handleDeleteClick = (responsible: Responsible) => {
    setDeleteState({ isOpen: true, responsible });
  };

  const handleModalClose = () => {
    setModal({ isOpen: false, type: 'create' });
  };

  const handleSubmit = async (data: ResponsibleCreate | ResponsibleUpdate) => {
    try {
      setSubmitting(true);

      if (modal.type === 'create') {
        await responsiblesService.create(data as ResponsibleCreate);
      } else if (modal.responsible) {
        await responsiblesService.update(modal.responsible.id, data as ResponsibleUpdate);
      }

      await fetchResponsibles();
      handleModalClose();
    } catch (error) {
      console.error('Error saving responsible:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteState.responsible) return;

    try {
      setDeleting(true);
      await responsiblesService.delete(deleteState.responsible.id);
      await fetchResponsibles();
      setDeleteState({ isOpen: false });
    } catch (error) {
      console.error('Error deleting responsible:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getModalTitle = () => {
    return modal.type === 'create' ? 'Crear Responsable' : 'Editar Responsable';
  };

  const getModalSubtitle = () => {
    return modal.type === 'create'
      ? 'Ingresa los datos del nuevo responsable'
      : 'Modifica los datos del responsable';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Responsables</h1>
          <p className="text-gray-600 mt-1">
            Gestione las personas responsables para la asignación de tickets
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Responsable
        </Button>
      </div>

      {/* Responsibles List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Responsables ({responsibles.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Personas disponibles para asignación automática de tickets
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando responsables...</p>
          </div>
        ) : responsibles.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {responsibles.map((responsible) => (
              <div key={responsible.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {responsible.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          responsible.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {responsible.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{responsible.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(responsible)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(responsible)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay responsables</h3>
            <p className="text-gray-500">
              No se encontraron responsables en el sistema.
            </p>
          </div>
        )}
      </div>

      {/* Modal de crear/editar */}
      <FormModal
        isOpen={modal.isOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        title={getModalTitle()}
        subtitle={getModalSubtitle()}
        isLoading={submitting}
        size="lg"
      >
        <ResponsibleForm
          responsible={modal.responsible}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      </FormModal>

      {/* Modal de confirmación para eliminar */}
      <ConfirmDialog
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Responsable"
        message={`¿Estás seguro de que deseas eliminar a ${deleteState.responsible?.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        isLoading={deleting}
      />
    </div>
  );
};

export default ResponsiblesPage;