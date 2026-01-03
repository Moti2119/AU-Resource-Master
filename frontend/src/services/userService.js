import api from './api';

export const userService = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
  delete: (id) => api.delete(`/users/${id}`),
};

