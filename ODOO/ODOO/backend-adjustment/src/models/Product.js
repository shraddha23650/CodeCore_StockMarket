/**
 * Product Model (for adjustment service)
 * Reference model for the shared products collection
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  sku: String,
  category: String,
  quantity: Number,
  reorderLevel: Number,
  unit: String,
  warehouse: String,
  stockHistory: Array,
  createdAt: Date,
  updatedAt: Date
}, { collection: 'products', strict: false });

module.exports = mongoose.model('Product', productSchema);

