/**
 * Adjustment Model
 */

const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  oldStock: {
    type: Number,
    required: [true, 'Old stock is required'],
    min: [0, 'Old stock cannot be negative']
  },
  newStock: {
    type: Number,
    required: [true, 'New stock is required'],
    min: [0, 'New stock cannot be negative']
  },
  adjustmentReason: {
    type: String,
    required: [true, 'Adjustment reason is required'],
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
  physicalCount: {
    type: Number,
    min: [0, 'Physical count cannot be negative']
  },
  status: {
    type: String,
    enum: ['draft', 'done'],
    default: 'draft'
  },
  adjustedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Adjusted by is required']
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
adjustmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
adjustmentSchema.index({ productId: 1 });
adjustmentSchema.index({ warehouse: 1 });
adjustmentSchema.index({ status: 1 });
adjustmentSchema.index({ date: -1 });

module.exports = mongoose.model('Adjustment', adjustmentSchema);

