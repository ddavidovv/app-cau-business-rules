import React, { useEffect, useState } from 'react';

// Componente temporal para debuggear la estructura de datos
const BusinessContextDebug: React.FC = () => {
  const [rawData, setRawData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/business-context');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Debug - Raw API Response:', data);
        setRawData(data);
      } catch (err) {
        console.error('Debug - Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-medium">Error loading data:</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!rawData) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <p>Loading debug data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded max-h-96 overflow-y-auto">
      <h3 className="text-blue-800 font-medium mb-2">Raw API Response Structure:</h3>
      <pre className="text-xs text-blue-900 whitespace-pre-wrap">
        {JSON.stringify(rawData, null, 2)}
      </pre>
    </div>
  );
};

export default BusinessContextDebug;