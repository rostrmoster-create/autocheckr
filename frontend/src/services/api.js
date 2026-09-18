import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getSession: () => api.get('/auth/session'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

export const vinAPI = {
  validate: (vin) => api.post('/vin/validate', { vin }),
  search: (vin) => api.post('/vin/search', { vin })
};

export const reportAPI = {
  get: (id) => api.get(`/reports/${id}`),
  getAll: () => api.get('/reports'),
  createPreview: (vehicleId) => api.post('/reports/preview', { vehicleId }),
  unlock: (vehicleId) => api.post('/reports/unlock', { vehicleId })
};

export const paymentAPI = {
  createCheckout: (productId) => api.post('/payments/create-checkout', { productId }),
  verifySession: (sessionId) => api.get(`/payments/verify/${sessionId}`)
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  getProducts: () => api.get('/admin/products'),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  getPayments: (params) => api.get('/admin/payments', { params }),
  getVinSearches: (params) => api.get('/admin/vin-searches', { params })
};

export default api;
