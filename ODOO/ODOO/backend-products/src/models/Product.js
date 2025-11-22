/**
 * Product Model
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  reorderLevel: {
    type: Number,
    default: 10,
    min: [0, 'Reorder level cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true,
    default: 'pcs'
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
  stockHistory: [{
    warehouse: String,
    location: String,
    quantity: Number,
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
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
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster searches
// SKU + warehouse combination should be unique
productSchema.index({ sku: 1, warehouse: 1 }, { unique: true });
productSchema.index({ warehouse: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);

