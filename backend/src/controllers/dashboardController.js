import Resource from '../models/Resource.js';
import Maintenance from '../models/Maintenance.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const lowStock = await Resource.getLowStock();
    const openIssues = await Maintenance.getByStatus('Pending');
    const inProgressIssues = await Maintenance.getByStatus('In Progress');

    const totalResources = await Resource.countDocuments();
    const totalIssues = await Maintenance.countDocuments();

    res.json({
      lowStockCount: lowStock.length,
      lowStock: lowStock.slice(0, 5),
      openIssuesCount: openIssues.length,
      openIssues: openIssues.slice(0, 5),
      inProgressIssuesCount: inProgressIssues.length,
      totalResources,
      totalIssues
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getInventoryDashboard = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ name: 1 });
    const lowStock = await Resource.getLowStock();

    const categoryStats = await Resource.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          total_quantity: { $sum: '$quantity' }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          total_quantity: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalResources: resources.length,
      lowStockCount: lowStock.length,
      resources,
      categoryStats
    });
  } catch (error) {
    console.error('Get inventory dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
