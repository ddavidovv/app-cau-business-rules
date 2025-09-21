import { apiGet, apiPost, apiPut, apiDelete } from './api';
import {
  Responsible,
  ResponsibleWithStats,
  CreateResponsibleData,
  UpdateResponsibleData,
  ResponsibleStats,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../types';

// Servicio para gestión de Responsables
export class ResponsibleService {
  private basePath = '/api/admin/responsibles';

  // Obtener todos los responsables
  async getAll(params?: PaginationParams & { active?: boolean }): Promise<PaginatedResponse<ResponsibleWithStats>> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order.toString());
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());

    const query = queryParams.toString();
    const endpoint = query ? `${this.basePath}?${query}` : this.basePath;

    return apiGet<PaginatedResponse<ResponsibleWithStats>>(endpoint);
  }

  // Obtener lista simple de responsables para selects
  async getList(q?: string): Promise<Responsible[]> {
    const endpoint = q ? `/api/catalog/responsibles?q=${encodeURIComponent(q)}` : '/api/catalog/responsibles';
    const response = await apiGet<{ responsibles: string[]; count: number }>(endpoint);

    // Convertir lista de emails a objetos Responsible
    return response.responsibles.map(email => ({
      responsible_email: email,
      active: true
    }));
  }

  // Obtener responsable por ID
  async getById(id: string): Promise<ResponsibleWithStats> {
    return apiGet<ResponsibleWithStats>(`${this.basePath}/${id}`);
  }

  // Crear nuevo responsable
  async create(data: CreateResponsibleData): Promise<ApiResponse<Responsible>> {
    return apiPost<ApiResponse<Responsible>>(this.basePath, data);
  }

  // Actualizar responsable
  async update(id: string, data: UpdateResponsibleData): Promise<ApiResponse<Responsible>> {
    return apiPut<ApiResponse<Responsible>>(`${this.basePath}/${id}`, data);
  }

  // Eliminar responsable
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiDelete<ApiResponse<void>>(`${this.basePath}/${id}`);
  }

  // Activar/Desactivar responsable
  async toggleActive(id: string, active: boolean): Promise<ApiResponse<Responsible>> {
    return apiPut<ApiResponse<Responsible>>(`${this.basePath}/${id}/toggle-active`, { active });
  }

  // Obtener estadísticas de responsables
  async getStats(): Promise<ResponsibleStats> {
    return apiGet<ResponsibleStats>('/api/admin/responsibles-stats');
  }

  // Buscar responsables por términos
  async search(query: string): Promise<Responsible[]> {
    return apiGet<Responsible[]>(`${this.basePath}/search?q=${encodeURIComponent(query)}`);
  }

  // Validar email único
  async validateEmail(email: string, excludeId?: string): Promise<{ available: boolean; message?: string }> {
    const params = new URLSearchParams({ email });
    if (excludeId) params.append('exclude_id', excludeId);

    return apiGet<{ available: boolean; message?: string }>(`${this.basePath}/validate-email?${params.toString()}`);
  }

  // Obtener responsables con más asignaciones
  async getTopResponsibles(limit: number = 10): Promise<Array<{
    responsible: Responsible;
    assignments_count: number;
    active_tickets_count: number;
  }>> {
    return apiGet<Array<{
      responsible: Responsible;
      assignments_count: number;
      active_tickets_count: number;
    }>>(`${this.basePath}/top?limit=${limit}`);
  }

  // Sincronizar responsables desde AD/LDAP (futuro)
  async syncFromDirectory(): Promise<ApiResponse<{ synced: number; errors: string[] }>> {
    return apiPost<ApiResponse<{ synced: number; errors: string[] }>>(`${this.basePath}/sync-directory`, {});
  }

  // Exportar responsables a CSV
  async exportCsv(): Promise<Blob> {
    const response = await fetch(`${this.basePath}/export-csv`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al exportar responsables');
    }

    return response.blob();
  }

  // Importar responsables desde CSV
  async importCsv(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.basePath}/import-csv`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al importar responsables');
    }

    return response.json();
  }
}

// Instancia singleton del servicio
export const responsibleService = new ResponsibleService();