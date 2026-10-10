import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('placetrack_access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register')
    ) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('placetrack_refresh_token');
      
      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh/`, { refresh });
          if (res.data && res.data.success) {
            const newAccess = res.data.data.access;
            localStorage.setItem('placetrack_access_token', newAccess);
            originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          
          localStorage.removeItem('placetrack_access_token');
          localStorage.removeItem('placetrack_refresh_token');
          localStorage.removeItem('placetrack_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
export default apiClient;
