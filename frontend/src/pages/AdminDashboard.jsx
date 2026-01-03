import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getAdminDashboard();
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#428bca] mb-8">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Low Stock Alerts</h3>
          <p className="text-3xl font-bold text-red-600">{data?.lowStockCount || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Open Issues</h3>
          <p className="text-3xl font-bold text-yellow-600">{data?.openIssuesCount || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-600 text-sm font-medium mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">{data?.inProgressIssuesCount || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#428bca]">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Resources</h3>
          <p className="text-3xl font-bold text-[#428bca]">{data?.totalResources || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Low Stock Resources</h3>
            <Link to="/resources" className="text-[#428bca] hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {data?.lowStock?.length > 0 ? (
              data.lowStock.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                  <div>
                    <p className="font-medium text-gray-800">{resource.name}</p>
                    <p className="text-sm text-gray-600">{resource.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold">{resource.quantity}</p>
                    <p className="text-xs text-gray-500">Threshold: {resource.minimum_threshold}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No low stock items</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Recent Issues</h3>
            <Link to="/maintenance" className="text-[#428bca] hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {data?.openIssues?.length > 0 ? (
              data.openIssues.map((issue) => (
                <div key={issue.id} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                  <p className="font-medium text-gray-800">{issue.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{issue.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      issue.priority === 'High' ? 'bg-red-100 text-red-700' :
                      issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {issue.priority}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(issue.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No open issues</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

