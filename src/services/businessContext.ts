import { apiGet, apiPost, apiPut, apiDelete } from './api';
import { BusinessContext, BusinessContextCreate, BusinessContextUpdate } from '../types/api';

export const businessContextService = {
  async getAll(q?: string): Promise<BusinessContext[]> {
    const params = q ? `?q=${encodeURIComponent(q)}` : '';
    return apiGet<BusinessContext[]>(`/api/admin/business-context${params}`);
  },

  async getById(id: string): Promise<BusinessContext> {
    return apiGet<BusinessContext>(`/api/admin/business-context/${id}`);
  },

  async create(data: BusinessContextCreate): Promise<BusinessContext> {
    return apiPost<BusinessContext>('/api/admin/business-context', data);
  },

  async update(id: string, data: BusinessContextUpdate): Promise<BusinessContext> {
    return apiPut<BusinessContext>(`/api/admin/business-context/${id}`, data);
  },

  async delete(id: string): Promise<{ message: string }> {
    return apiDelete<{ message: string }>(`/api/admin/business-context/${id}`);
  },
};