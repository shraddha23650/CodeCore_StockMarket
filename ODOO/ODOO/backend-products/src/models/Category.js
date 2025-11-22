/**
 * Category Model
 */

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: [true, 'Category code is required'],
    trim: true,
    uppercase: true,
    unique: true
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

categorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

categorySchema.index({ code: 1 }, { unique: true });
categorySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);

