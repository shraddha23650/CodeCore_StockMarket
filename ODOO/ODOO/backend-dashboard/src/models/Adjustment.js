/**
 * Adjustment Model (for dashboard queries)
 */

const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  oldStock: Number,
  newStock: Number,
  adjustmentReason: String,
  warehouse: String,
  adjustedBy: mongoose.Schema.Types.ObjectId,
  date: Date,
  createdAt: Date
}, { collection: 'adjustments', strict: false });

module.exports = mongoose.model('Adjustment', adjustmentSchema);

