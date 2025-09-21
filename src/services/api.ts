// Configuración base de la API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Headers comunes para todas las peticiones
const getCommonHeaders = () => {
  const token = sessionStorage.getItem('idToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Función base para hacer peticiones HTTP
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getCommonHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.detail || errorMessage;
    } catch {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

// Función para peticiones GET
export const apiGet = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'GET' });
};

// Función para peticiones POST
export const apiPost = <T>(endpoint: string, data: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Función para peticiones PUT
export const apiPut = <T>(endpoint: string, data: any): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// Función para peticiones DELETE
export const apiDelete = <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
};

// Función para peticiones con FormData (archivos)
export const apiPostFormData = <T>(endpoint: string, formData: FormData): Promise<T> => {
  const token = sessionStorage.getItem('idToken');

  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
      // No incluir Content-Type para FormData
    },
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  });
};