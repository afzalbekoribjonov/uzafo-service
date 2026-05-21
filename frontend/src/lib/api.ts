import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage to avoid circular dependency with authStore
    const authData = localStorage.getItem('uzafo_auth');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (e) {
        console.error('Error parsing auth data from localStorage', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect if needed
      localStorage.removeItem('uzafo_auth');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
