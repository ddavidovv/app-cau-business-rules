// Tipos comunes del sistema
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  limit?: number;
  skip?: number;
  sort_by?: string;
  sort_order?: 1 | -1;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  skip: number;
  has_more: boolean;
}

export type Priority = 'Baja' | 'Media' | 'Alta' | 'Crítica';
export type RequestType = 'Incidencia' | 'Requerimiento';

export interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}