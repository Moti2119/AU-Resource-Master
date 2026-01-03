import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

const InventoryDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardService.getInventoryDashboard();
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
      <h2 className="text-3xl font-bold text-[#428bca] mb-8">Inventory Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-[#428bca]">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Resources</h3>
          <p className="text-3xl font-bold text-[#428bca]">{data?.totalResources || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-600">{data?.lowStockCount || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-secondary">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Categories</h3>
          <p className="text-3xl font-bold text-secondary">{data?.categoryStats?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.categoryStats?.map((stat) => (
            <div key={stat.category} className="p-4 bg-gray-50 rounded">
              <p className="font-semibold text-gray-800">{stat.category}</p>
              <p className="text-sm text-gray-600 mt-1">
                {stat.count} items • Total: {stat.total_quantity}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;

