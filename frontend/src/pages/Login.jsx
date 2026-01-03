import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      onLogin(response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)' }}>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md border border-gray-200">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://www.eesarchitects.net/wp-content/uploads/2024/07/cropped-Screenshot-2024-07-22-150353.png" 
              alt="Ambo University Logo" 
              className="h-24 w-auto object-contain"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-24 h-24 bg-[#428bca] rounded-full flex items-center justify-center shadow-lg hidden">
              <span className="text-white text-3xl font-bold">AU</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#428bca] mb-2">Resource Master</h1>
          <p className="text-gray-600 text-lg font-medium">Ambo University</p>
          <div className="mt-2 text-sm text-gray-500">University Resource Management System</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca] focus:border-[#428bca] transition"
              placeholder="email@ambouniversity.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca] focus:border-[#428bca] transition"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-[#428bca] focus:ring-[#428bca]" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-[#428bca] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#428bca] text-white py-3 rounded-lg font-semibold hover:bg-[#357abd] transition disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#428bca] hover:underline font-semibold">
            Register
          </Link>
        </p>

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <Link to="https://estudent.ambou.edu.et/estudent/available_programs/index" className="hover:text-[#428bca]">Available Programs</Link>
            <span>•</span>
            <Link to="https://estudent.ambou.edu.et/auth/login#transcript_verification" className="hover:text-[#428bca]">Official Transcript</Link>
            <span>•</span>
            <Link to="https://estudent.ambou.edu.et/auth/login#student_search" className="hover:text-[#428bca]">Student Verification</Link>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">Version 2.0 • Powered by Ambo University</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
