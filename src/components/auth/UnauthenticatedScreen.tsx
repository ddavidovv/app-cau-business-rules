import React from 'react';
import { Shield, ExternalLink } from 'lucide-react';

const UnauthenticatedScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="rounded-full bg-yellow-100 p-3 w-16 h-16 mx-auto mb-4">
          <Shield className="h-10 w-10 text-yellow-600" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Acceso Requerido
        </h2>

        <p className="text-gray-600 mb-6">
          Esta aplicación debe abrirse desde la aplicación principal para acceder a las funcionalidades de administración.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                ¿Cómo acceder?
              </h3>
              <p className="text-sm text-blue-700">
                1. Abra la aplicación principal<br />
                2. Inicie sesión con sus credenciales<br />
                3. Navegue a la sección de administración<br />
                4. Seleccione "Gestión de Reglas de Negocio"
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          CAU Business Rules Admin - Versión 1.0.0
        </p>
      </div>
    </div>
  );
};

export default UnauthenticatedScreen;