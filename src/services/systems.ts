import { apiGet, apiPost, apiPut, apiDelete } from './api';
import { System, SystemCreate, SystemUpdate } from '../types/api';

export const systemsService = {
  async getAll(q?: string): Promise<{ systems: System[]; count: number }> {
    const params = q ? `?q=${encodeURIComponent(q)}` : '';
    return apiGet<{ systems: System[]; count: number }>(`/api/admin/systems${params}`);
  },

  async create(data: SystemCreate): Promise<System> {
    return apiPost<System>('/api/admin/systems', data);
  },

  async update(id: string, data: SystemUpdate): Promise<System> {
    return apiPut<System>(`/api/admin/systems/${id}`, data);
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiDelete<{ message: string }>(`/api/admin/systems/${id}`);
  },
};