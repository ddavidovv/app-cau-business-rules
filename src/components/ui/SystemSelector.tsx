import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Check, AlertCircle } from 'lucide-react';
import { systemService } from '../../services/systemService';

interface SystemSelectorProps {
  selectedSystems: string[];
  onChange: (systems: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
  maxSelections?: number;
}

const SystemSelector: React.FC<SystemSelectorProps> = ({
  selectedSystems,
  onChange,
  placeholder = "Buscar y seleccionar sistemas...",
  className = "",
  error,
  disabled = false,
  maxSelections
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSystems, setAvailableSystems] = useState<string[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cargar sistemas disponibles
  useEffect(() => {
    loadSystems();
  }, []);

  // Filtrar sistemas basado en búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSystems(availableSystems);
    } else {
      const filtered = availableSystems.filter(system =>
        system.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedSystems.includes(system)
      );
      setFilteredSystems(filtered);
    }
  }, [searchTerm, availableSystems, selectedSystems]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSystems = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const systems = await systemService.getList();
      setAvailableSystems(systems.map(s => s.system_name || '').filter(Boolean));
    } catch (error) {
      setLoadError('Error cargando sistemas');
      console.error('Error loading systems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSelect = (system: string) => {
    if (selectedSystems.includes(system)) return;

    if (maxSelections && selectedSystems.length >= maxSelections) {
      return; // No permitir más selecciones
    }

    const newSystems = [...selectedSystems, system];
    onChange(newSystems);
    setSearchTerm('');

    // Mantener focus en el input para continuar añadiendo
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSystemRemove = (systemToRemove: string) => {
    const newSystems = selectedSystems.filter(system => system !== systemToRemove);
    onChange(newSystems);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSystems.length === 1) {
        handleSystemSelect(filteredSystems[0]);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Sistemas seleccionados */}
      {selectedSystems.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedSystems.map((system) => (
            <span
              key={system}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md border border-blue-200"
            >
              <Check className="h-3 w-3" />
              {system}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleSystemRemove(system)}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Input de búsqueda */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={handleInputClick}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full pl-10 pr-4 py-2 border rounded-md shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              disabled:bg-gray-50 disabled:text-gray-500
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
            `}
          />
        </div>

        {/* Dropdown de sistemas */}
        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <span className="mt-2 block">Cargando sistemas...</span>
              </div>
            ) : loadError ? (
              <div className="p-4 text-center text-red-500">
                <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                <span className="block">{loadError}</span>
                <button
                  onClick={loadSystems}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Reintentar
                </button>
              </div>
            ) : filteredSystems.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No se encontraron sistemas' : 'No hay sistemas disponibles'}
              </div>
            ) : (
              <>
                {maxSelections && selectedSystems.length >= maxSelections && (
                  <div className="p-3 bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm">
                    Máximo {maxSelections} sistemas permitidos
                  </div>
                )}
                {filteredSystems.map((system) => (
                  <button
                    key={system}
                    type="button"
                    onClick={() => handleSystemSelect(system)}
                    disabled={maxSelections ? selectedSystems.length >= maxSelections : false}
                    className={`
                      w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none
                      ${selectedSystems.includes(system) ? 'bg-blue-100 text-blue-800' : 'text-gray-900'}
                      ${maxSelections && selectedSystems.length >= maxSelections ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{system}</span>
                      {selectedSystems.includes(system) && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
        <span>
          {selectedSystems.length} sistema{selectedSystems.length !== 1 ? 's' : ''} seleccionado{selectedSystems.length !== 1 ? 's' : ''}
          {maxSelections ? ` de ${maxSelections} máximo` : ''}
        </span>
        {availableSystems.length > 0 && (
          <span>{availableSystems.length} sistemas disponibles</span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default SystemSelector;