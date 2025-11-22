/**
 * Warehouse Model
 */

const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Warehouse name is required'],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Warehouse code is required'],
    trim: true,
    uppercase: true,
    unique: true
  },
  address: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
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

warehouseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

warehouseSchema.index({ code: 1 }, { unique: true });
warehouseSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);

