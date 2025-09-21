import { apiGet, apiPost, apiPut, apiDelete } from './api';
import { Responsible, ResponsibleCreate, ResponsibleUpdate } from '../types/api';

export const responsiblesService = {
  async getAll(q?: string): Promise<{ responsibles: Responsible[]; count: number }> {
    const params = q ? `?q=${encodeURIComponent(q)}` : '';
    return apiGet<{ responsibles: Responsible[]; count: number }>(`/api/admin/responsibles${params}`);
  },

  async create(data: ResponsibleCreate): Promise<Responsible> {
    return apiPost<Responsible>('/api/admin/responsibles', data);
  },

  async update(id: string, data: ResponsibleUpdate): Promise<Responsible> {
    return apiPut<Responsible>(`/api/admin/responsibles/${id}`, data);
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiDelete<{ message: string }>(`/api/admin/responsibles/${id}`);
  },
};