import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Verificando autenticación...
        </h2>
        <p className="text-gray-600">
          Estableciendo conexión segura
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;