/**
 * Product Model (for dashboard queries)
 * This is a reference model - actual model is in products service
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
  createdAt: Date,
  updatedAt: Date
}, { collection: 'products', strict: false });

module.exports = mongoose.model('Product', productSchema);

