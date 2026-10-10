import { apiClient } from './client';

export const authApi = {
  
  async register(name, email, password) {
    const response = await apiClient.post('/auth/register/', { name, email, password });
    return response.data; 
  },

  
  async login(email, password) {
    const response = await apiClient.post('/auth/login/', { email, password });
    return response.data; 
  },

  async getMe() {
    const response = await apiClient.get('/auth/me/');
    return response.data; 
  }
};
export default authApi;
