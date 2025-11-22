/**
 * Transfer Model
 */

const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  fromWarehouse: {
    type: String,
    required: [true, 'From warehouse is required'],
    trim: true
  },
  toWarehouse: {
    type: String,
    required: [true, 'To warehouse is required'],
    trim: true
  },
  fromLocation: {
    type: String,
    trim: true
  },
  toLocation: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  transferredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Transferred by is required']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'waiting', 'ready', 'done', 'canceled', 'failed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
transferSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
transferSchema.index({ productId: 1 });
transferSchema.index({ fromWarehouse: 1 });
transferSchema.index({ toWarehouse: 1 });
transferSchema.index({ status: 1 });
transferSchema.index({ date: -1 });

module.exports = mongoose.model('Transfer', transferSchema);

