/**
 * Delivery Model
 */

const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
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
  deliveredTo: {
    type: String,
    required: [true, 'Delivered to is required'],
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
    enum: ['draft', 'waiting', 'ready', 'picking', 'packing', 'done', 'canceled'],
    default: 'draft'
  },
  pickedQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Picked quantity cannot be negative']
  },
  packedQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Packed quantity cannot be negative']
  },
  deliveredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Delivered by is required']
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
deliverySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
deliverySchema.index({ productId: 1 });
deliverySchema.index({ warehouse: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ date: -1 });

module.exports = mongoose.model('Delivery', deliverySchema);

