/**
 * Delivery Model (for dashboard queries)
 */

const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number,
  deliveredTo: String,
  warehouse: String,
  deliveredBy: mongoose.Schema.Types.ObjectId,
  date: Date,
  createdAt: Date
}, { collection: 'deliveries', strict: false });

module.exports = mongoose.model('Delivery', deliverySchema);

