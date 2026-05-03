import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://votesmart-backend-656894301486.asia-south1.run.app/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('votesmart_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Chat API
export const chatService = {
  sendMessage: (message, state, lang) =>
    api.post('/chat', { message, state, lang }).then(r => r.data),
};

// Auth API
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }).then(r => r.data),
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
};

// Feedback API
export const feedbackService = {
  submit: (data) => api.post('/feedback', data).then(r => r.data),
};

// Registration API
export const registrationService = {
  submit: (data) => api.post('/registration/submit', data).then(r => r.data),
  status: (id) => api.get(`/registration/status/${id}`).then(r => r.data),
};

export default api;
