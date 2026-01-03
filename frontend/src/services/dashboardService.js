import api from './api';

export const dashboardService = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getInventoryDashboard: () => api.get('/dashboard/inventory'),
};

