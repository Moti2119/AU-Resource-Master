import { useState, useEffect } from 'react';
import { resourceService } from '../services/resourceService';
import { authService } from '../services/authService';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    location: '',
    minimum_threshold: ''
  });
  const user = authService.getCurrentUser();
  const canEdit = user?.role === 'Admin' || user?.role === 'Inventory Manager';

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await resourceService.getAll();
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await resourceService.update(editingResource.id, formData);
      } else {
        await resourceService.create(formData);
      }
      setShowModal(false);
      setEditingResource(null);
      setFormData({ name: '', category: '', quantity: '', location: '', minimum_threshold: '' });
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert(error.response?.data?.error || 'Failed to save resource');
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      category: resource.category,
      quantity: resource.quantity.toString(),
      location: resource.location,
      minimum_threshold: resource.minimum_threshold.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await resourceService.delete(id);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  const getStatusColor = (quantity, threshold) => {
    if (quantity < threshold) return 'bg-red-100 text-red-800';
    if (quantity < threshold * 1.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (loading) {
    return <div className="text-center py-12">Loading resources...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#428bca]">Resources</h2>
        {canEdit && (
          <button
            onClick={() => {
              setEditingResource(null);
              setFormData({ name: '', category: '', quantity: '', location: '', minimum_threshold: '' });
              setShowModal(true);
            }}
            className="bg-[#428bca] text-white px-6 py-2 rounded-lg hover:bg-[#357abd] transition"
          >
            + Add Resource
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Threshold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              {canEdit && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{resource.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{resource.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{resource.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{resource.minimum_threshold}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{resource.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(resource.quantity, resource.minimum_threshold)}`}>
                    {resource.quantity < resource.minimum_threshold ? 'Low Stock' : 'OK'}
                  </span>
                </td>
                {canEdit && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="text-[#428bca] hover:underline"
                    >
                      Edit
                    </button>
                    {user?.role === 'Admin' && (
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-[#428bca] mb-6">
              {editingResource ? 'Edit Resource' : 'Add Resource'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca]"
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Books">Books</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Supplies">Supplies</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Threshold</label>
                <input
                  type="number"
                  required
                  value={formData.minimum_threshold}
                  onChange={(e) => setFormData({ ...formData, minimum_threshold: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#428bca]"
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#428bca] text-white py-2 rounded-lg hover:bg-[#357abd] transition"
                >
                  {editingResource ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingResource(null);
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

export default Resources;

