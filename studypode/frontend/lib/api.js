import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
};

export const rides = {
  create: (data) => api.post('/rides', data),
  getAll: () => api.get('/rides'),
  getAvailable: () => api.get('/rides/available'),
  accept: (id) => api.post(`/rides/${id}/accept`),
  start: (id) => api.post(`/rides/${id}/start`),
  complete: (id) => api.post(`/rides/${id}/complete`),
  cancel: (id) => api.post(`/rides/${id}/cancel`),
  updateLocation: (id, location) => api.post(`/rides/${id}/location`, location),
};

export const users = {
  getMe: () => api.get('/users/me'),
  updateLocation: (location) => api.put('/users/location', location),
  updateAvailability: (isAvailable) => api.put('/users/availability', { isAvailable }),
  getDrivers: (lat, lng) => api.get('/users/drivers', { params: { lat, lng } }),
};

export default api;
