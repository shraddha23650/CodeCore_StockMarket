/**
 * Transfer Model (for dashboard queries)
 */

const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  fromWarehouse: String,
  toWarehouse: String,
  quantity: Number,
  transferredBy: mongoose.Schema.Types.ObjectId,
  date: Date,
  status: String,
  createdAt: Date
}, { collection: 'transfers', strict: false });

module.exports = mongoose.model('Transfer', transferSchema);

