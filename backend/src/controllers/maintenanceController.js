import Maintenance from '../models/Maintenance.js';

export const getAllIssues = async (req, res) => {
  try {
    const issues = await Maintenance.find()
      .populate('reporter_id', 'name email')
      .populate('assignee_id', 'name email')
      .sort({ createdAt: -1 });
    // Transform _id to id and add reporter_name, assignee_name for frontend compatibility
    const transformedIssues = issues.map(issue => ({
      ...issue.toObject(),
      id: issue._id.toString(),
      reporter_name: issue.reporter_id?.name || 'Unknown',
      assignee_name: issue.assignee_id?.name || null
    }));
    res.json(transformedIssues);
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getIssue = async (req, res) => {
  try {
    const issue = await Maintenance.findById(req.params.id)
      .populate('reporter_id', 'name email')
      .populate('assignee_id', 'name email');
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    // Transform _id to id and add reporter_name, assignee_name for frontend compatibility
    res.json({
      ...issue.toObject(),
      id: issue._id.toString(),
      reporter_name: issue.reporter_id?.name || 'Unknown',
      assignee_name: issue.assignee_id?.name || null
    });
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createIssue = async (req, res) => {
  try {
    const { title, description, location, priority } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ error: 'Title, description, and location are required' });
    }

    const issue = await Maintenance.create({
      title,
      description,
      location,
      reporter_id: req.user.id,
      priority: priority || 'Medium'
    });

    const populatedIssue = await Maintenance.findById(issue._id)
      .populate('reporter_id', 'name email')
      .populate('assignee_id', 'name email');

    // Transform _id to id and add reporter_name, assignee_name for frontend compatibility
    res.status(201).json({
      ...populatedIssue.toObject(),
      id: populatedIssue._id.toString(),
      reporter_name: populatedIssue.reporter_id?.name || 'Unknown',
      assignee_name: populatedIssue.assignee_id?.name || null
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateIssue = async (req, res) => {
  try {
    // Don't allow updating reporter_id (only the original reporter should be set)
    const { reporter_id, ...updateData } = req.body;
    
    // Ensure status and priority are valid enum values if provided
    if (updateData.status && !['Pending', 'In Progress', 'Fixed'].includes(updateData.status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    if (updateData.priority && !['Low', 'Medium', 'High'].includes(updateData.priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    const issue = await Maintenance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('reporter_id', 'name email')
      .populate('assignee_id', 'name email');
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    // Transform _id to id and add reporter_name, assignee_name for frontend compatibility
    res.json({
      ...issue.toObject(),
      id: issue._id.toString(),
      reporter_name: issue.reporter_id?.name || 'Unknown',
      assignee_name: issue.assignee_id?.name || null
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getIssuesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const issues = await Maintenance.getByStatus(status);
    // Transform _id to id and add reporter_name, assignee_name for frontend compatibility
    const transformedIssues = issues.map(issue => ({
      ...issue.toObject(),
      id: issue._id.toString(),
      reporter_name: issue.reporter_id?.name || 'Unknown',
      assignee_name: issue.assignee_id?.name || null
    }));
    res.json(transformedIssues);
  } catch (error) {
    console.error('Get issues by status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
