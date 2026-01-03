import api from './api';

export const maintenanceService = {
  getAll: () => api.get('/maintenance'),
  getById: (id) => api.get(`/maintenance/${id}`),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  getByStatus: (status) => api.get(`/maintenance/status/${status}`),
};

