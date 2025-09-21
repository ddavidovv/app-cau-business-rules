import React, { useState, useEffect } from 'react';
import { X, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Input, Modal, TagInput } from '../ui';
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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: businessContext?.name || '',
    description: businessContext?.description || '',
    keywords: businessContext?.keywords || [],
    alias: businessContext?.alias || [],
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
        keywords: businessContext.keywords || [],
        alias: businessContext.alias || [],
        projectManager: businessContext.projectManager || '',
        affectedSystems: businessContext.assignmentRules?.affected_systems || [],
        defaultPriority: businessContext.assignmentRules?.default_priority || 'MEDIUM',
      });
    } else {
      // Reset form for new context
      setFormData({
        name: '',
        description: '',
        keywords: [],
        alias: [],
        projectManager: '',
        affectedSystems: [],
        defaultPriority: 'MEDIUM',
      });
    }
    // Clear any existing errors and reset to first step
    setErrors({});
    setCurrentStep(1);
  }, [businessContext]);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'La descripción es requerida';
      }
    } else if (step === 2) {
      if (formData.keywords.length === 0) {
        newErrors.keywords = 'Las palabras clave son requeridas';
      }
    } else if (step === 3) {
      if (formData.projectManager && !formData.projectManager.includes('@')) {
        newErrors.projectManager = 'Debe ser un email válido';
      }
      if (formData.projectManager && !validResponsibles.includes(formData.projectManager)) {
        newErrors.projectManager = 'El responsable debe estar en el catálogo autorizado';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData: BusinessContextCreate | BusinessContextUpdate = {
        name: formData.name,
        description: formData.description,
        keywords: formData.keywords,
        alias: formData.alias.length > 0 ? formData.alias : undefined,
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

  const getStepTitle = () => {
    const stepTitles = {
      1: 'Información Básica',
      2: 'Clasificación IA',
      3: 'Reglas de Asignación'
    };
    return `${title} (Paso ${currentStep} de ${totalSteps}: ${stepTitles[currentStep as keyof typeof stepTitles]})`;
  };

  const getButtonText = () => {
    if (currentStep < totalSteps) return 'Siguiente';
    return isSubmitting ? 'Guardando...' : submitText;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Información contextual */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">¿Qué son las Reglas de Negocio?</h3>
              <p className="text-sm text-blue-800 mb-2">
                Las reglas de negocio permiten que la IA clasifique automáticamente los tickets
                basándose en palabras clave específicas y asigne el responsable apropiado.
              </p>
              <p className="text-sm text-blue-700">
                Cada regla debe tener un nombre descriptivo y una descripción clara del contexto
                que debe capturar.
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
                rows={4}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.description ? 'border-red-300' : ''}`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Información contextual */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">🎯 Configuración de Clasificación IA</h3>
              <p className="text-sm text-green-800">
                Define las palabras clave que la IA utilizará para identificar automáticamente
                los tickets que pertenecen a este contexto de negocio.
              </p>
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
              <TagInput
                value={formData.keywords}
                onChange={(keywords) => handleInputChange('keywords', keywords)}
                placeholder="Escribir palabra clave y presionar Enter..."
                error={errors.keywords}
                helpText="🎯 Palabras específicas que garantizan la asignación automática"
              />
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
              <TagInput
                value={formData.alias}
                onChange={(alias) => handleInputChange('alias', alias)}
                placeholder="Escribir término alternativo y presionar Enter..."
                helpText="💡 Términos adicionales que podrían indicar el mismo contexto. Opcional."
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Información contextual */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">⚙️ Configuración de Asignación</h3>
              <p className="text-sm text-purple-800">
                Define cómo la IA debe asignar automáticamente los tickets que coincidan
                con las palabras clave configuradas.
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

            {/* Sistemas Afectados */}
            <div>
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
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{getStepTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-blue-600 text-white'
                      : step < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              Paso {currentStep} de {totalSteps}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {renderStepContent()}
        </form>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div>
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Atrás
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
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
              {currentStep < totalSteps && <ChevronRight className="h-4 w-4 mr-1" />}
              {getButtonText()}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BusinessContextForm;