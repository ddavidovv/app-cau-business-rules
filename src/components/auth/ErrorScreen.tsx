import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui';

interface ErrorScreenProps {
  error: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto mb-4">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Error de Autenticación
        </h2>

        <p className="text-gray-600 mb-6">
          {error}
        </p>

        <div className="space-y-3">
          <Button onClick={handleRefresh} variant="primary" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de Nuevo
          </Button>

          <p className="text-sm text-gray-500">
            Si el problema persiste, contacte al administrador del sistema
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;