import { apiClient } from './client';

export const applicationsApi = {
  
  async getApplications(limit) {
    const url = limit ? `/applications/?limit=${limit}` : '/applications/';
    const response = await apiClient.get(url);
    return response.data; // Expected: { success: true, data: [...] }
  },

  
  async getApplication(id) {
    const response = await apiClient.get(`/applications/${id}/`);
    return response.data;
  },

  
  async createApplication(data) {
    const response = await apiClient.post('/applications/', data);
    return response.data;
  },

  
  async updateApplication(id, data) {
    const response = await apiClient.patch(`/applications/${id}/`, data);
    return response.data;
  },

  
  async deleteApplication(id) {
    const response = await apiClient.delete(`/applications/${id}/`);
    return response.data;
  },

  async getApplicationStats() {
    const response = await apiClient.get('/applications/stats/');
    return response.data;
  }
};
export default applicationsApi;
