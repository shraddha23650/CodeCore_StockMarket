/**
 * Receipt Model (for dashboard queries)
 */

const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number,
  supplier: String,
  warehouse: String,
  receivedBy: mongoose.Schema.Types.ObjectId,
  date: Date,
  createdAt: Date
}, { collection: 'receipts', strict: false });

module.exports = mongoose.model('Receipt', receiptSchema);

