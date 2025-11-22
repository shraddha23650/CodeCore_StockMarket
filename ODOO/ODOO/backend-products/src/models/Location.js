/**
 * Location Model (Racks/Areas within Warehouse)
 */

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Location code is required'],
    trim: true,
    uppercase: true
  },
  warehouse: {
    type: String,
    required: [true, 'Warehouse is required'],
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

locationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Location code should be unique within a warehouse
locationSchema.index({ code: 1, warehouse: 1 }, { unique: true });
locationSchema.index({ warehouse: 1 });

module.exports = mongoose.model('Location', locationSchema);

