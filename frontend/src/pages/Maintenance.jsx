import { useState, useEffect } from 'react';
import { maintenanceService } from '../services/maintenanceService';
import { authService } from '../services/authService';

const Maintenance = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'Medium'
  });
  const user = authService.getCurrentUser();
  const canEdit = user?.role === 'Admin' || user?.role === 'Inventory Manager';

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const response = await maintenanceService.getAll();
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIssue) {
        await maintenanceService.update(editingIssue.id, formData);
      } else {
        await maintenanceService.create(formData);
      }
      setShowModal(false);
      setEditingIssue(null);
      setFormData({ title: '', description: '', location: '', priority: 'Medium' });
      fetchIssues();
    } catch (error) {
      console.error('Error saving issue:', error);
      alert(error.response?.data?.error || 'Failed to save issue');
    }
  };

  const handleEdit = (issue) => {
    setEditingIssue(issue);
    setFormData({
      title: issue.title,
      description: issue.description,
      location: issue.location,
      priority: issue.priority,
      status: issue.status
    });
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Fixed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading issues...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#428bca]">Maintenance Issues</h2>
        <button
          onClick={() => {
            setEditingIssue(null);
            setFormData({ title: '', description: '', location: '', priority: 'Medium' });
            setShowModal(true);
          }}
          className="bg-[#428bca] text-white px-6 py-2 rounded-lg hover:bg-[#357abd] transition"
        >
          + Report Issue
        </button>
      </div>

      <div className="space-y-4">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{issue.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                    {issue.priority}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{issue.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>📍 {issue.location}</span>
                  <span>👤 Reported by: {issue.reporter_name || 'Unknown'}</span>
                  {issue.assignee_name && <span>🔧 Assigned to: {issue.assignee_name}</span>}
                  <span>📅 {new Date(issue.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {canEdit && (
                <button
                  onClick={() => handleEdit(issue)}
                  className="ml-4 text-[#428bca] hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#428bca] mb-6">
              {editingIssue ? 'Edit Issue' : 'Report Issue'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca]"
                >
                  <option value="">Select location</option>
                  <option value="Library">Library</option>
                  <option value="Lab">Lab</option>
                  <option value="Cafeteria">Cafeteria</option>
                  <option value="Classroom">Classroom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              {editingIssue && canEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>
              )}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#428bca] text-white py-2 rounded-lg hover:bg-[#357abd] transition"
                >
                  {editingIssue ? 'Update' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingIssue(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;

