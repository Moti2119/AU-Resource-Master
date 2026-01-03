import Resource from '../models/Resource.js';
import { sendTelegramNotification } from '../config/telegram.js';

export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ name: 1 });
    // Transform _id to id for frontend compatibility
    const transformedResources = resources.map(resource => ({
      ...resource.toObject(),
      id: resource._id.toString()
    }));
    res.json(transformedResources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    // Transform _id to id for frontend compatibility
    res.json({
      ...resource.toObject(),
      id: resource._id.toString()
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createResource = async (req, res) => {
  try {
    const { name, category, quantity, location, minimum_threshold } = req.body;

    if (!name || !category || quantity === undefined || !location || minimum_threshold === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const resource = await Resource.create({
      name,
      category,
      quantity: parseInt(quantity),
      location,
      minimum_threshold: parseInt(minimum_threshold)
    });

    // Transform _id to id for frontend compatibility
    res.status(201).json({
      ...resource.toObject(),
      id: resource._id.toString()
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateResource = async (req, res) => {
  try {
    const oldResource = await Resource.findById(req.params.id);
    if (!oldResource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Parse numeric fields to ensure they're numbers
    const updateData = {
      ...req.body,
      quantity: req.body.quantity !== undefined ? parseInt(req.body.quantity) : oldResource.quantity,
      minimum_threshold: req.body.minimum_threshold !== undefined ? parseInt(req.body.minimum_threshold) : oldResource.minimum_threshold
    };

    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Check if quantity dropped below threshold
    if (oldResource.quantity >= oldResource.minimum_threshold && 
        resource.quantity < resource.minimum_threshold) {
      await sendTelegramNotification(
        `⚠️ <b>Low Stock Alert</b>\n\n` +
        `Resource: <b>${resource.name}</b>\n` +
        `Current Quantity: <b>${resource.quantity}</b>\n` +
        `Minimum Threshold: <b>${resource.minimum_threshold}</b>\n` +
        `Location: ${resource.location}`
      );
    }

    // Transform _id to id for frontend compatibility
    res.json({
      ...resource.toObject(),
      id: resource._id.toString()
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getLowStock = async (req, res) => {
  try {
    const resources = await Resource.getLowStock();
    // Transform _id to id for frontend compatibility
    const transformedResources = resources.map(resource => ({
      ...resource.toObject(),
      id: resource._id.toString()
    }));
    res.json(transformedResources);
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
