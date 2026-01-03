import mongoose from 'mongoose';
import { sendTelegramNotification } from '../config/telegram.js';

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  minimum_threshold: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
resourceSchema.index({ category: 1 });
resourceSchema.index({ location: 1 });

// Static method to get low stock items
resourceSchema.statics.getLowStock = async function() {
  return await this.find({
    $expr: { $lt: ['$quantity', '$minimum_threshold'] }
  }).sort({ quantity: 1 });
};

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
