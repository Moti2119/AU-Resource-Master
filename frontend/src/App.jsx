import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from './services/authService';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import InventoryDashboard from './pages/InventoryDashboard';
import Resources from './pages/Resources';
import Maintenance from './pages/Maintenance';
import UserManagement from './pages/UserManagement';
import AdminResetPassword from './pages/AdminResetPassword';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              user?.role === 'Admin' ? (
                <AdminDashboard />
              ) : (
                <InventoryDashboard />
              )
            }
          />
          <Route path="resources" element={<Resources />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="admin/reset-password" element={<AdminResetPassword />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

