import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button, Input, Modal } from '../ui';
import { System, SystemCreate, SystemUpdate } from '../../types/api';

interface SystemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SystemCreate | SystemUpdate) => Promise<void>;
  system?: System;
  title: string;
  submitText: string;
}

const SystemForm: React.FC<SystemFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  system,
  title,
  submitText
}) => {
  const [formData, setFormData] = useState({
    name: system?.name || '',
    description: system?.description || '',
    category: system?.category || '',
    owner: system?.owner || '',
    environment: system?.environment || 'production',
    criticality_level: system?.criticality_level || 'medium' as const,
    monitoring_url: system?.monitoring_url || '',
    documentation_url: system?.documentation_url || '',
    tags: system?.tags?.join(', ') || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.environment.trim()) {
      newErrors.environment = 'El entorno es requerido';
    }

    if (formData.monitoring_url && !isValidUrl(formData.monitoring_url)) {
      newErrors.monitoring_url = 'URL de monitoreo no válida';
    }

    if (formData.documentation_url && !isValidUrl(formData.documentation_url)) {
      newErrors.documentation_url = 'URL de documentación no válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const submitData: SystemCreate | SystemUpdate = {
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category || undefined,
        owner: formData.owner || undefined,
        environment: formData.environment,
        criticality_level: formData.criticality_level,
        monitoring_url: formData.monitoring_url || undefined,
        documentation_url: formData.documentation_url || undefined,
        tags,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting system:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Sistema *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="ej. Sistema de Facturación"
                className={errors.name ? 'border-red-300' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <Input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="ej. ERP, CRM, Core"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe el propósito y funcionalidad del sistema..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Propietario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Propietario/Responsable
              </label>
              <Input
                type="text"
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                placeholder="ej. juan.perez@cttexpress.com"
              />
            </div>

            {/* Entorno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entorno *
              </label>
              <select
                value={formData.environment}
                onChange={(e) => handleInputChange('environment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="development">Desarrollo</option>
                <option value="testing">Testing</option>
                <option value="staging">Staging</option>
                <option value="production">Producción</option>
              </select>
              {errors.environment && (
                <p className="mt-1 text-sm text-red-600">{errors.environment}</p>
              )}
            </div>
          </div>

          {/* Nivel de Criticidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Criticidad *
            </label>
            <select
              value={formData.criticality_level}
              onChange={(e) => handleInputChange('criticality_level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Bajo</option>
              <option value="medium">Medio</option>
              <option value="high">Alto</option>
              <option value="critical">Crítico</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* URL de Monitoreo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Monitoreo
              </label>
              <Input
                type="url"
                value={formData.monitoring_url}
                onChange={(e) => handleInputChange('monitoring_url', e.target.value)}
                placeholder="https://monitoring.cttexpress.com/system"
                className={errors.monitoring_url ? 'border-red-300' : ''}
              />
              {errors.monitoring_url && (
                <p className="mt-1 text-sm text-red-600">{errors.monitoring_url}</p>
              )}
            </div>

            {/* URL de Documentación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Documentación
              </label>
              <Input
                type="url"
                value={formData.documentation_url}
                onChange={(e) => handleInputChange('documentation_url', e.target.value)}
                placeholder="https://docs.cttexpress.com/system"
                className={errors.documentation_url ? 'border-red-300' : ''}
              />
              {errors.documentation_url && (
                <p className="mt-1 text-sm text-red-600">{errors.documentation_url}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <Input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="ej. core, billing, finance (separados por comas)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separe múltiples tags con comas
            </p>
          </div>
        </form>

        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : submitText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SystemForm;