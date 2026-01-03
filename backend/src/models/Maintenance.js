import mongoose from 'mongoose';
import { sendTelegramNotification } from '../config/telegram.js';

const maintenanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Fixed'],
    default: 'Pending'
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  reporter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
maintenanceSchema.index({ status: 1 });
maintenanceSchema.index({ reporter_id: 1 });

// Send notification when new issue is created
maintenanceSchema.post('save', async function(doc) {
  if (doc.isNew) {
    await sendTelegramNotification(
      `🔧 <b>New Maintenance Issue</b>\n\n` +
      `Title: <b>${doc.title}</b>\n` +
      `Location: ${doc.location}\n` +
      `Priority: ${doc.priority}\n` +
      `Status: ${doc.status}\n\n` +
      `Description: ${doc.description.substring(0, 100)}...`
    );
  }
});

// Static method to get by status
maintenanceSchema.statics.getByStatus = async function(status) {
  return await this.find({ status })
    .populate('reporter_id', 'name email')
    .populate('assignee_id', 'name email')
    .sort({ createdAt: -1 });
};

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
