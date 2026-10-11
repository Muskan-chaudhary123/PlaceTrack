import { apiClient } from './client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://placetrack-backend-7k0s.onrender.com/api/';

export const resourcesApi = {
  /**
   * Fetch all resources for the logged in user with optional filtering/search.
   */
  async getResources(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.type && params.type !== 'All') query.append('type', params.type);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiClient.get(`/resources/${queryString}`);
    return res.data;
  },

  /**
   * Get a single resource by ID.
   */
  async getResource(id) {
    const res = await apiClient.get(`/resources/${id}/`);
    return res.data;
  },

  /**
   * Create a new resource, supporting file uploads via FormData.
   */
  async createResource(data, file = null, onUploadProgress = null) {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      Object.keys(data).forEach((key) => {
        if (key === 'file') return;
        const val = data[key];
        if (key === 'checklistItems' || key === 'tags') {
          formData.append(key, JSON.stringify(val || []));
        } else if (typeof val === 'boolean') {
          formData.append(key, val ? 'true' : 'false');
        } else if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });

      const res = await apiClient.post('/resources/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
      });
      return res.data;
    }

    const res = await apiClient.post('/resources/', data);
    return res.data;
  },

  /**
   * Update an existing resource, optionally replacing or removing file.
   */
  async updateResource(id, data, file = null, removeFile = false, onUploadProgress = null) {
    if (file || removeFile) {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (removeFile) formData.append('removeFile', 'true');

      Object.keys(data).forEach((key) => {
        if (key === 'file') return;
        const val = data[key];
        if (key === 'checklistItems' || key === 'tags') {
          formData.append(key, JSON.stringify(val || []));
        } else if (typeof val === 'boolean') {
          formData.append(key, val ? 'true' : 'false');
        } else if (val !== undefined && val !== null) {
          formData.append(key, String(val));
        }
      });

      const res = await apiClient.patch(`/resources/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
      });
      return res.data;
    }

    const res = await apiClient.patch(`/resources/${id}/`, data);
    return res.data;
  },

  /**
   * Delete a resource and its stored file.
   */
  async deleteResource(id) {
    const res = await apiClient.delete(`/resources/${id}/`);
    return res.data;
  },

  /**
   * Toggle a single checklist item.
   */
  async toggleChecklistItem(id, itemId) {
    const res = await apiClient.patch(`/resources/${id}/checklist/${itemId}/`);
    return res.data;
  },

  /**
   * Download a resource file and trigger browser download.
   */
  async downloadFile(id, fallbackName = 'document') {
    const res = await apiClient.get(`/resources/${id}/file/`, {
      responseType: 'blob'
    });
    
    // Extract filename from Content-Disposition if present
    let filename = fallbackName;
    const disposition = res.headers['content-disposition'];
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) filename = match[1];
    }

    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  },

  /**
   * Fetch a resource file as a Blob URL for browser inline preview.
   */
  async getFileBlobUrl(id) {
    const res = await apiClient.get(`/resources/${id}/file/?preview=1`, {
      responseType: 'blob'
    });
    const blob = new Blob([res.data], { type: res.data.type || 'application/pdf' });
    return window.URL.createObjectURL(blob);
  },

  /**
   * Get direct preview URL with authenticated token query param.
   */
  getDirectFileUrl(id, preview = true) {
    const token = localStorage.getItem('placetrack_access_token');
    const params = new URLSearchParams();
    if (preview) params.append('preview', '1');
    if (token) params.append('token', token);
    return `${API_BASE_URL}/resources/${id}/file/?${params.toString()}`;
  }
};

export default resourcesApi;

