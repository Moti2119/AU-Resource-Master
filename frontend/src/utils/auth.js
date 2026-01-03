import { authService } from '../services/authService';

export const requireAuth = () => {
  if (!authService.isAuthenticated()) {
    window.location.href = '/login';
    return false;
  }
  return true;
};

export const requireRole = (...roles) => {
  const user = authService.getCurrentUser();
  if (!user || !roles.includes(user.role)) {
    window.location.href = '/unauthorized';
    return false;
  }
  return true;
};

