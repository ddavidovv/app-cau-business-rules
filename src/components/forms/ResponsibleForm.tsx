import React, { useEffect, useState } from 'react';
import { Input } from '../ui';
import { Responsible, ResponsibleCreate, ResponsibleUpdate } from '../../types/api';

interface ResponsibleFormProps {
  responsible?: Responsible;
  onSubmit: (data: ResponsibleCreate | ResponsibleUpdate) => void;
  isLoading?: boolean;
}

export const ResponsibleForm: React.FC<ResponsibleFormProps> = ({
  responsible,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (responsible) {
      setFormData({
        name: responsible.name || '',
        email: responsible.email || '',
      });
    }
  }, [responsible]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name,
      email: formData.email,
    };

    onSubmit(submitData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Información del responsable</h4>

        <Input
          label="Nombre completo"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          disabled={isLoading}
          placeholder="Ej: Juan Pérez"
        />

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
          disabled={isLoading}
          placeholder="juan.perez@cttexpress.com"
        />
      </div>
    </form>
  );
};