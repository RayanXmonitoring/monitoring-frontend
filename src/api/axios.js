import axios from 'axios';
import { getCurrentUser } from '../config/firebase';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 30000;
const MAX_RETRY_ATTEMPTS = parseInt(process.env.REACT_APP_MAX_RETRY_ATTEMPTS) || 3;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const user = getCurrentUser();
    if (user) {
      try {
        const token = await user.getIdToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      toast.error('Koneksi internet bermasalah');
      return Promise.reject(error);
    }

    const { status } = error.response;

    // Handle 401 - Token expired
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const user = getCurrentUser();
        if (user) {
          const newToken = await user.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403
    if (status === 403) {
      toast.error('Akses ditolak');
      if (originalRequest.url?.includes('/admin')) {
        setTimeout(() => window.location.href = '/dashboard', 1500);
      }
    }

    // Handle 404
    if (status === 404) {
      toast.error('Data tidak ditemukan');
    }

    // Handle 422 - Validation error
    if (status === 422) {
      const errors = error.response.data?.errors || error.response.data?.message;
      if (typeof errors === 'object') {
        Object.values(errors).forEach(msg => toast.error(msg));
      } else if (errors) {
        toast.error(errors);
      }
    }

    // Handle 429 - Too many requests
    if (status === 429) {
      toast.error('Terlalu banyak permintaan, coba lagi nanti');
    }

    // Handle 500+
    if (status >= 500) {
      toast.error('Terjadi kesalahan pada server');
      console.error('Server error:', error);
    }

    // Custom error message
    if (error.response.data?.message && status !== 422) {
      toast.error(error.response.data.message);
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', {
        status,
        url: originalRequest.url,
        method: originalRequest.method,
        data: error.response?.data
      });
    }

    return Promise.reject(error);
  }
);

// Retry wrapper
const retryRequest = async (fn, retries = MAX_RETRY_ATTEMPTS) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (MAX_RETRY_ATTEMPTS - retries + 1)));
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// API methods
const apiMethods = {
  get: (url, config = {}) => retryRequest(() => api.get(url, config)),
  post: (url, data = {}, config = {}) => retryRequest(() => api.post(url, data, config)),
  put: (url, data = {}, config = {}) => retryRequest(() => api.put(url, data, config)),
  patch: (url, data = {}, config = {}) => retryRequest(() => api.patch(url, data, config)),
  delete: (url, config = {}) => retryRequest(() => api.delete(url, config)),
  
  upload: (url, formData, onProgress) => {
    return retryRequest(() => 
      api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        }
      })
    );
  },
  
  download: (url, config = {}) => {
    return retryRequest(() => 
      api.get(url, {
        ...config,
        responseType: 'blob'
      })
    );
  },

  cancelToken: () => axios.CancelToken.source(),
  cancel: (source) => source && source.cancel('Request canceled')
};

export default api;
export { apiMethods };
