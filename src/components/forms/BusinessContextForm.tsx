import React, { useState, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { Button, Input, Modal } from '../ui';
import SystemSelector from '../ui/SystemSelector';
import ResponsibleSelector from '../ui/ResponsibleSelector';
import { BusinessContext, BusinessContextCreate, BusinessContextUpdate } from '../../types/api';

interface BusinessContextFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BusinessContextCreate | BusinessContextUpdate) => Promise<void>;
  businessContext?: BusinessContext;
  title: string;
  submitText: string;
}

const BusinessContextForm: React.FC<BusinessContextFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  businessContext,
  title,
  submitText
}) => {
  const [formData, setFormData] = useState({
    name: businessContext?.name || '',
    description: businessContext?.description || '',
    keywords: businessContext?.keywords?.join(', ') || '',
    alias: businessContext?.alias?.join(', ') || '',
    projectManager: businessContext?.projectManager || '',
    affectedSystems: businessContext?.assignmentRules?.affected_systems || [],
    defaultPriority: businessContext?.assignmentRules?.default_priority || 'MEDIUM',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validResponsibles, setValidResponsibles] = useState<string[]>([]);

  // Load valid responsibles
  useEffect(() => {
    const loadValidResponsibles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/catalog/responsibles');
        const data = await response.json();
        setValidResponsibles(data.responsibles || []);
      } catch (error) {
        console.error('Error loading valid responsibles:', error);
      }
    };
    loadValidResponsibles();
  }, []);

  // Effect to update form data when businessContext changes
  useEffect(() => {
    if (businessContext) {
      setFormData({
        name: businessContext.name || '',
        description: businessContext.description || '',
        keywords: businessContext.keywords?.join(', ') || '',
        alias: businessContext.alias?.join(', ') || '',
        projectManager: businessContext.projectManager || '',
        affectedSystems: businessContext.assignmentRules?.affected_systems || [],
        defaultPriority: businessContext.assignmentRules?.default_priority || 'MEDIUM',
      });
    } else {
      // Reset form for new context
      setFormData({
        name: '',
        description: '',
        keywords: '',
        alias: '',
        projectManager: '',
        affectedSystems: [],
        defaultPriority: 'MEDIUM',
      });
    }
    // Clear any existing errors when business context changes
    setErrors({});
  }, [businessContext]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Las palabras clave son requeridas';
    }

    if (formData.projectManager && !formData.projectManager.includes('@')) {
      newErrors.projectManager = 'Debe ser un email válido';
    }

    if (formData.projectManager && !validResponsibles.includes(formData.projectManager)) {
      newErrors.projectManager = 'El responsable debe estar en el catálogo autorizado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const keywords = formData.keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      const alias = formData.alias
        .split(',')
        .map(alias => alias.trim())
        .filter(alias => alias.length > 0);

      const submitData: BusinessContextCreate | BusinessContextUpdate = {
        name: formData.name,
        description: formData.description,
        keywords,
        alias: alias.length > 0 ? alias : undefined,
        projectManager: formData.projectManager || undefined,
        assignment_rules: {
          responsible_person: formData.projectManager || '',
          affected_systems: formData.affectedSystems,
          default_priority: formData.defaultPriority as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
        }
      };

      console.log('DEBUG Frontend - Datos a enviar:', submitData);
      console.log('DEBUG Frontend - assignment_rules:', submitData.assignment_rules);

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting business context:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const FieldInfo: React.FC<{ title: string; description: string; example?: string }> = ({
    title,
    description,
    example
  }) => (
    <div className="group relative">
      <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
      <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-sm rounded-lg py-2 px-3 -top-2 left-6 w-64">
        <div className="font-medium mb-1">{title}</div>
        <div className="text-gray-300 mb-1">{description}</div>
        {example && (
          <div className="text-gray-400 text-xs">Ejemplo: {example}</div>
        )}
        <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
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
          {/* Información contextual */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">¿Qué son las Reglas de Negocio?</h3>
            <p className="text-sm text-blue-800 mb-2">
              Las reglas de negocio permiten que la IA clasifique automáticamente los tickets
              basándose en palabras clave específicas y asigne el responsable apropiado.
            </p>
            <p className="text-sm text-blue-700">
              Cada regla debe tener un nombre descriptivo, palabras clave que garanticen la asignación,
              y opcionalmente términos alternativos para mejorar la detección.
            </p>
          </div>

          {/* Nombre */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la Regla *
              </label>
              <FieldInfo
                title="Nombre Descriptivo"
                description="Un nombre claro que identifique el ámbito o contexto de negocio"
                example="Sistema de Facturación, Portal Clientes, ERP Financiero"
              />
            </div>
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

          {/* Descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Descripción *
              </label>
              <FieldInfo
                title="Descripción del Contexto"
                description="Explica qué tipo de tickets debe capturar esta regla y por qué"
                example="Incidencias relacionadas con el proceso de facturación, emisión de facturas, y errores en el cálculo de importes"
              />
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe el tipo de incidencias que debe capturar esta regla..."
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-300' : ''}`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Palabras Clave */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Palabras Clave Específicas *
              </label>
              <FieldInfo
                title="Keywords Específicas"
                description="Palabras que GARANTIZAN la asignación automática. Deben ser muy específicas para evitar falsos positivos"
                example="factura, facturación, invoice, billing"
              />
            </div>
            <Input
              type="text"
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              placeholder="factura, facturación, invoice, billing (separadas por comas)"
              className={errors.keywords ? 'border-red-300' : ''}
            />
            <p className="mt-1 text-sm text-gray-500">
              🎯 Palabras específicas que garantizan la asignación automática. Separe con comas.
            </p>
            {errors.keywords && (
              <p className="mt-1 text-sm text-red-600">{errors.keywords}</p>
            )}
          </div>

          {/* Términos Alternativos */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Términos Alternativos / Alias
              </label>
              <FieldInfo
                title="Alias y Términos Coloquiales"
                description="Términos alternativos, abreviaciones o formas coloquiales que los usuarios podrían usar"
                example="cobro, factoring, billing, recibo"
              />
            </div>
            <Input
              type="text"
              value={formData.alias}
              onChange={(e) => handleInputChange('alias', e.target.value)}
              placeholder="cobro, factoring, billing, recibo (separados por comas)"
            />
            <p className="mt-1 text-sm text-gray-500">
              💡 Términos adicionales que podrían indicar el mismo contexto. Opcional.
            </p>
          </div>

          {/* Project Manager */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Responsable Principal (Project Manager)
              </label>
              <FieldInfo
                title="Responsable del Ámbito"
                description="Email del responsable principal que debe recibir los tickets de este contexto"
                example="juan.perez@cttexpress.com"
              />
            </div>
            <ResponsibleSelector
              value={formData.projectManager}
              onChange={(value) => handleInputChange('projectManager', value)}
              error={errors.projectManager}
              placeholder="Seleccionar responsable del catálogo..."
            />
          </div>

          {/* Sección de Reglas de Asignación */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
              🎯 Reglas de Asignación Automática
              <FieldInfo
                title="Reglas de Asignación IA"
                description="Configuración avanzada para que la IA asigne automáticamente los sistemas y prioridad"
              />
            </h3>

            {/* Sistemas Afectados */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sistemas Afectados
                </label>
                <FieldInfo
                  title="Sistemas del Contexto"
                  description="Sistemas que típicamente se ven afectados en este contexto de negocio. La IA los sugerirá automáticamente."
                  example="ERP, Portal Clientes, Sistema Facturación"
                />
              </div>
              <SystemSelector
                selectedSystems={formData.affectedSystems}
                onChange={(systems) => handleInputChange('affectedSystems', systems)}
                placeholder="Buscar y seleccionar sistemas relacionados..."
                error={errors.affectedSystems}
                maxSelections={5}
              />
              <p className="mt-1 text-sm text-gray-500">
                🏗️ Sistemas que la IA incluirá automáticamente al detectar este contexto
              </p>
            </div>

            {/* Prioridad por Defecto */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Prioridad por Defecto
                </label>
                <FieldInfo
                  title="Prioridad Automática"
                  description="Prioridad que asignará la IA si no detecta indicadores específicos de urgencia"
                  example="MEDIUM para contextos generales, HIGH para sistemas críticos"
                />
              </div>
              <select
                value={formData.defaultPriority}
                onChange={(e) => handleInputChange('defaultPriority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LOW">🟢 Baja - Puede esperar</option>
                <option value="MEDIUM">🟡 Media - Atención normal</option>
                <option value="HIGH">🟠 Alta - Requiere atención pronto</option>
                <option value="CRITICAL">🔴 Crítica - Atención inmediata</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                ⚖️ Prioridad base que usará la IA para tickets de este contexto
              </p>
            </div>
          </div>

          {/* Próximas funcionalidades */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">🚧 Próximamente disponibles:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Indicadores de criticidad por palabras clave específicas</li>
              <li>• Validación con preview de IA en tiempo real</li>
              <li>• Configuración de escalado automático por tiempo</li>
              <li>• Reglas de asignación por horarios y disponibilidad</li>
            </ul>
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

export default BusinessContextForm;