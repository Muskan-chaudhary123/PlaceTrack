import { apiClient } from './client';

export const questionsApi = {
  
  async getQuestions() {
    const response = await apiClient.get('/questions/');
    return response.data; // Expected: { success: true, data: [...] }
  },

  
  async getQuestion(id) {
    const response = await apiClient.get(`/questions/${id}/`);
    return response.data;
  },

  async createQuestion(data) {
    const response = await apiClient.post('/questions/', data);
    return response.data;
  },

  
  async updateQuestion(id, data) {
    const response = await apiClient.patch(`/questions/${id}/`, data);
    return response.data;
  },

  
  async deleteQuestion(id) {
    const response = await apiClient.delete(`/questions/${id}/`);
    return response.data;
  },

  async getSettings() {
    const response = await apiClient.get('/questions/settings/');
    return response.data; // Expected: { success: true, data: { subjects, topics, customColumns } }
  },

  async saveSettings(data) {
    const response = await apiClient.post('/questions/settings/', data);
    return response.data;
  }
};
export default questionsApi;
