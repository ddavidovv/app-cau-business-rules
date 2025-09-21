import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, User, AlertCircle } from 'lucide-react';
import { apiGet } from '../../services/api';

interface ResponsibleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

interface Responsible {
  email: string;
}

const ResponsibleSelector: React.FC<ResponsibleSelectorProps> = ({
  value,
  onChange,
  error,
  placeholder = "Seleccionar responsable...",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [responsibles, setResponsibles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadResponsibles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadResponsibles = async () => {
    try {
      setLoading(true);
      const response = await apiGet<{responsibles: string[], count: number}>('/api/catalog/responsibles');
      setResponsibles(response.responsibles || []);
    } catch (error) {
      console.error('Error loading responsibles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResponsibles = responsibles.filter(email =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (email: string) => {
    onChange(email);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedResponsible = value ? value : null;
  const isValidSelection = !value || responsibles.includes(value);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`
          relative w-full px-3 py-2 text-left bg-white border rounded-md shadow-sm cursor-pointer
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          ${error || !isValidSelection ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className={selectedResponsible ? 'text-gray-900' : 'text-gray-500'}>
              {selectedResponsible || placeholder}
            </span>
            {!isValidSelection && value && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Barra de búsqueda */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* Lista de responsables */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Cargando responsables...</div>
            ) : filteredResponsibles.length > 0 ? (
              <>
                {/* Opción para limpiar selección */}
                {value && (
                  <div
                    className="flex items-center px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelect('')}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4" />
                      <span className="text-gray-500 italic">Sin responsable</span>
                    </div>
                  </div>
                )}

                {filteredResponsibles.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-50"
                    onClick={() => handleSelect(email)}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{email}</span>
                    </div>
                    {value === email && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                ))}
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm ? 'No se encontraron responsables' : 'No hay responsables disponibles'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Advertencia si el valor no es válido */}
      {!isValidSelection && value && (
        <p className="mt-1 text-sm text-red-600">
          ⚠️ Este responsable no está en el catálogo. Selecciona uno válido.
        </p>
      )}

      {/* Información de ayuda */}
      <p className="mt-1 text-sm text-gray-500">
        👤 Solo se pueden seleccionar responsables del catálogo autorizado.
      </p>
    </div>
  );
};

export default ResponsibleSelector;