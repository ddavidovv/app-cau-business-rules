import { apiGet, apiPost, apiPut, apiDelete } from './api';
import {
  System,
  SystemWithStats,
  CreateSystemData,
  UpdateSystemData,
  SystemStats,
  SystemCategory,
  ApiResponse,
  PaginatedResponse,
  PaginationParams
} from '../types';

// Servicio para gestión de Sistemas
export class SystemService {
  private basePath = '/api/admin/systems';

  // Obtener todos los sistemas
  async getAll(params?: PaginationParams & {
    active?: boolean;
    category?: SystemCategory;
  }): Promise<PaginatedResponse<SystemWithStats>> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order.toString());
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    if (params?.category) queryParams.append('category', params.category);

    const query = queryParams.toString();
    const endpoint = query ? `${this.basePath}?${query}` : this.basePath;

    return apiGet<PaginatedResponse<SystemWithStats>>(endpoint);
  }

  // Obtener lista simple de sistemas para selects
  async getList(q?: string): Promise<System[]> {
    const endpoint = q ? `/api/catalog/systems?q=${encodeURIComponent(q)}` : '/api/catalog/systems';
    const response = await apiGet<{ systems: string[]; count: number }>(endpoint);

    // Convertir lista de nombres a objetos System
    return response.systems.map(name => ({
      system_name: name,
      active: true
    }));
  }

  // Obtener sistema por ID
  async getById(id: string): Promise<SystemWithStats> {
    return apiGet<SystemWithStats>(`${this.basePath}/${id}`);
  }

  // Crear nuevo sistema
  async create(data: CreateSystemData): Promise<ApiResponse<System>> {
    return apiPost<ApiResponse<System>>(this.basePath, data);
  }

  // Actualizar sistema
  async update(id: string, data: UpdateSystemData): Promise<ApiResponse<System>> {
    return apiPut<ApiResponse<System>>(`${this.basePath}/${id}`, data);
  }

  // Eliminar sistema
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiDelete<ApiResponse<void>>(`${this.basePath}/${id}`);
  }

  // Activar/Desactivar sistema
  async toggleActive(id: string, active: boolean): Promise<ApiResponse<System>> {
    return apiPut<ApiResponse<System>>(`${this.basePath}/${id}/toggle-active`, { active });
  }

  // Obtener estadísticas de sistemas
  async getStats(): Promise<SystemStats> {
    return apiGet<SystemStats>('/api/admin/systems-stats');
  }

  // Buscar sistemas por términos
  async search(query: string): Promise<System[]> {
    return apiGet<System[]>(`${this.basePath}/search?q=${encodeURIComponent(query)}`);
  }

  // Validar nombre único
  async validateName(name: string, excludeId?: string): Promise<{ available: boolean; message?: string }> {
    const params = new URLSearchParams({ name });
    if (excludeId) params.append('exclude_id', excludeId);

    return apiGet<{ available: boolean; message?: string }>(`${this.basePath}/validate-name?${params.toString()}`);
  }

  // Obtener sistemas por categoría
  async getByCategory(): Promise<Record<SystemCategory, System[]>> {
    return apiGet<Record<SystemCategory, System[]>>(`${this.basePath}/by-category`);
  }

  // Obtener sistemas más utilizados
  async getTopSystems(limit: number = 10): Promise<Array<{
    system: System;
    usage_count: number;
    active_tickets_count: number;
    rules_count: number;
  }>> {
    return apiGet<Array<{
      system: System;
      usage_count: number;
      active_tickets_count: number;
      rules_count: number;
    }>>(`${this.basePath}/top?limit=${limit}`);
  }

  // Obtener categorías disponibles
  async getCategories(): Promise<SystemCategory[]> {
    return apiGet<SystemCategory[]>(`${this.basePath}/categories`);
  }

  // Mover sistemas entre categorías (batch)
  async moveToCategory(systemIds: string[], category: SystemCategory): Promise<ApiResponse<{ moved: number }>> {
    return apiPut<ApiResponse<{ moved: number }>>(`${this.basePath}/move-category`, {
      system_ids: systemIds,
      category
    });
  }

  // Sincronizar sistemas desde inventario/CMDB (futuro)
  async syncFromInventory(): Promise<ApiResponse<{ synced: number; errors: string[] }>> {
    return apiPost<ApiResponse<{ synced: number; errors: string[] }>>(`${this.basePath}/sync-inventory`, {});
  }

  // Exportar sistemas a CSV
  async exportCsv(): Promise<Blob> {
    const response = await fetch(`${this.basePath}/export-csv`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('idToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al exportar sistemas');
    }

    return response.blob();
  }

  // Importar sistemas desde CSV
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
      throw new Error('Error al importar sistemas');
    }

    return response.json();
  }

  // Verificar integridad de sistemas (detectar inconsistencias)
  async checkIntegrity(): Promise<{
    orphaned_systems: string[];
    unused_systems: string[];
    duplicate_systems: string[];
    recommendations: string[];
  }> {
    return apiGet<{
      orphaned_systems: string[];
      unused_systems: string[];
      duplicate_systems: string[];
      recommendations: string[];
    }>(`${this.basePath}/check-integrity`);
  }
}

// Instancia singleton del servicio
export const systemService = new SystemService();