import { apiGet, apiPost, apiPut, apiDelete } from './api';
import {
  BusinessContext,
  CreateBusinessContextData,
  UpdateBusinessContextData,
  ValidationResult,
  ClassificationPreview,
  BusinessContextStats,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../types';

// Servicio para gestión de Business Context
export class BusinessContextService {
  private basePath = '/api/admin/business-context';

  // Obtener todos los business contexts
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<BusinessContext>> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order.toString());

    const query = queryParams.toString();
    const endpoint = query ? `${this.basePath}?${query}` : this.basePath;

    return apiGet<PaginatedResponse<BusinessContext>>(endpoint);
  }

  // Obtener business context por ID
  async getById(id: string): Promise<BusinessContext> {
    return apiGet<BusinessContext>(`${this.basePath}/${id}`);
  }

  // Crear nuevo business context
  async create(data: CreateBusinessContextData): Promise<ApiResponse<BusinessContext>> {
    return apiPost<ApiResponse<BusinessContext>>(this.basePath, data);
  }

  // Actualizar business context
  async update(id: string, data: UpdateBusinessContextData): Promise<ApiResponse<BusinessContext>> {
    return apiPut<ApiResponse<BusinessContext>>(`${this.basePath}/${id}`, data);
  }

  // Eliminar business context
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiDelete<ApiResponse<void>>(`${this.basePath}/${id}`);
  }

  // Validar business context antes de guardar
  async validate(data: CreateBusinessContextData | UpdateBusinessContextData): Promise<ValidationResult> {
    return apiPost<ValidationResult>('/api/admin/validate-context', data);
  }

  // Preview de clasificación de IA
  async previewClassification(title: string, description: string): Promise<ClassificationPreview> {
    return apiPost<ClassificationPreview>('/api/admin/preview-classification', {
      title,
      description
    });
  }

  // Obtener estadísticas de business contexts
  async getStats(): Promise<BusinessContextStats> {
    return apiGet<BusinessContextStats>('/api/admin/context-stats');
  }

  // Obtener sugerencias para nuevos contexts
  async getSuggestions(): Promise<{
    keywords: string[];
    aliases: string[];
    systems: string[];
    responsibles: string[];
  }> {
    return apiGet<{
      keywords: string[];
      aliases: string[];
      systems: string[];
      responsibles: string[];
    }>('/api/admin/suggestions');
  }

  // Buscar business contexts por términos
  async search(query: string): Promise<BusinessContext[]> {
    return apiGet<BusinessContext[]>(`${this.basePath}/search?q=${encodeURIComponent(query)}`);
  }

  // Duplicar business context
  async duplicate(id: string, name: string): Promise<ApiResponse<BusinessContext>> {
    return apiPost<ApiResponse<BusinessContext>>(`${this.basePath}/${id}/duplicate`, { name });
  }

  // Exportar business contexts a JSON
  async export(): Promise<Blob> {
    const response = await fetch(`${this.basePath}/export`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al exportar business contexts');
    }

    return response.blob();
  }

  // Importar business contexts desde JSON
  async import(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.basePath}/import`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al importar business contexts');
    }

    return response.json();
  }
}

// Instancia singleton del servicio
export const businessContextService = new BusinessContextService();