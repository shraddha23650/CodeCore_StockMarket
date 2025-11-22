/**
 * Receipt Model
 */

const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required'],
    trim: true
  },
  warehouse: {
    type: String,
    required: [true, 'Warehouse is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'waiting', 'ready', 'done', 'canceled'],
    default: 'draft'
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Received by is required']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
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
receiptSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
receiptSchema.index({ productId: 1 });
receiptSchema.index({ warehouse: 1 });
receiptSchema.index({ status: 1 });
receiptSchema.index({ date: -1 });

module.exports = mongoose.model('Receipt', receiptSchema);

