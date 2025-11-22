/**
 * Dashboard Service
 * Provides analytics and KPIs for the inventory management system
 */

const Product = require('../models/Product');
const Receipt = require('../models/Receipt');
const Delivery = require('../models/Delivery');
const Transfer = require('../models/Transfer');
const Adjustment = require('../models/Adjustment');
const logger = require('../../shared/utils/logger');

class DashboardService {
  async getSummary(filters = {}) {
    const { warehouse, category, startDate, endDate } = filters;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // Build product filter
    const productFilter = { ...dateFilter };
    if (warehouse) {
      productFilter.warehouse = warehouse;
    }
    if (category) {
      productFilter.category = category;
    }

    // Build operation filters
    const operationFilter = { ...dateFilter };
    if (warehouse) {
      operationFilter.warehouse = warehouse;
    }

    // Get product statistics
    const totalProducts = await Product.countDocuments(productFilter);
    
    const products = await Product.find(productFilter);
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
    
    const lowStockItems = products.filter(p => p.quantity <= p.reorderLevel && p.quantity > 0).length;
    const outOfStockItems = products.filter(p => p.quantity === 0).length;

    // Get receipt statistics
    const receiptFilter = { ...operationFilter };
    if (startDate || endDate) {
      receiptFilter.date = dateFilter.createdAt;
    }
    const receipts = await Receipt.find(receiptFilter);
    const totalReceived = receipts.filter(r => r.status === 'done').reduce((sum, r) => sum + r.quantity, 0);
    const pendingReceipts = receipts.filter(r => ['draft', 'waiting', 'ready'].includes(r.status)).length;

    // Get delivery statistics
    const deliveryFilter = { ...operationFilter };
    if (startDate || endDate) {
      deliveryFilter.date = dateFilter.createdAt;
    }
    const deliveries = await Delivery.find(deliveryFilter);
    const totalDelivered = deliveries.filter(d => d.status === 'done').reduce((sum, d) => sum + d.quantity, 0);
    const pendingDeliveries = deliveries.filter(d => ['draft', 'waiting', 'ready', 'picking', 'packing'].includes(d.status)).length;

    // Get transfer statistics
    const transferFilter = {};
    if (startDate || endDate) {
      transferFilter.date = dateFilter.createdAt;
    }
    if (warehouse) {
      transferFilter.$or = [
        { fromWarehouse: warehouse },
        { toWarehouse: warehouse }
      ];
    }
    const transfers = await Transfer.find(transferFilter);
    const totalTransfers = transfers.filter(t => t.status === 'done').length;
    const totalTransferredQuantity = transfers.filter(t => t.status === 'done').reduce((sum, t) => sum + t.quantity, 0);
    const pendingTransfers = transfers.filter(t => ['draft', 'waiting', 'ready'].includes(t.status)).length;

    // Get adjustment statistics
    const adjustmentFilter = { ...operationFilter };
    if (startDate || endDate) {
      adjustmentFilter.date = dateFilter.createdAt;
    }
    const adjustments = await Adjustment.find(adjustmentFilter);
    const totalAdjustments = adjustments.filter(a => a.status === 'done').length;
    const pendingAdjustments = adjustments.filter(a => a.status === 'draft').length;

    return {
      totalProducts,
      totalStock,
      lowStockItems,
      outOfStockItems,
      totalReceived,
      totalDelivered,
      totalTransfers,
      totalTransferredQuantity,
      totalAdjustments,
      pendingReceipts,
      pendingDeliveries,
      pendingTransfers,
      pendingAdjustments,
      filters: {
        warehouse: warehouse || 'all',
        category: category || 'all',
        dateRange: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      }
    };
  }

  async getMovements(filters = {}) {
    const { warehouse, productId, category, operationType, startDate, endDate } = filters;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.date.$lte = new Date(endDate);
      }
    }

    const movements = [];

    // Get receipts if operation type is 'receipt' or 'all'
    if (!operationType || operationType === 'receipt' || operationType === 'all') {
      const receiptFilter = { ...dateFilter };
      if (warehouse) {
        receiptFilter.warehouse = warehouse;
      }
      if (productId) {
        receiptFilter.productId = productId;
      }

      const receipts = await Receipt.find(receiptFilter)
        .populate('productId', 'name sku category')
        .populate('receivedBy', 'name email')
        .sort({ date: -1 })
        .limit(100);

      receipts.forEach(receipt => {
        movements.push({
          type: 'receipt',
          id: receipt._id,
          product: receipt.productId,
          quantity: receipt.quantity,
          warehouse: receipt.warehouse,
          user: receipt.receivedBy,
          date: receipt.date,
          details: {
            supplier: receipt.supplier
          }
        });
      });
    }

    // Get deliveries if operation type is 'delivery' or 'all'
    if (!operationType || operationType === 'delivery' || operationType === 'all') {
      const deliveryFilter = { ...dateFilter };
      if (warehouse) {
        deliveryFilter.warehouse = warehouse;
      }
      if (productId) {
        deliveryFilter.productId = productId;
      }

      const deliveries = await Delivery.find(deliveryFilter)
        .populate('productId', 'name sku category')
        .populate('deliveredBy', 'name email')
        .sort({ date: -1 })
        .limit(100);

      deliveries.forEach(delivery => {
        movements.push({
          type: 'delivery',
          id: delivery._id,
          product: delivery.productId,
          quantity: delivery.quantity,
          warehouse: delivery.warehouse,
          user: delivery.deliveredBy,
          date: delivery.date,
          details: {
            deliveredTo: delivery.deliveredTo
          }
        });
      });
    }

    // Get transfers if operation type is 'transfer' or 'all'
    if (!operationType || operationType === 'transfer' || operationType === 'all') {
      const transferFilter = { ...dateFilter };
      if (warehouse) {
        transferFilter.$or = [
          { fromWarehouse: warehouse },
          { toWarehouse: warehouse }
        ];
      }
      if (productId) {
        transferFilter.productId = productId;
      }

      const transfers = await Transfer.find(transferFilter)
        .populate('productId', 'name sku category')
        .populate('transferredBy', 'name email')
        .sort({ date: -1 })
        .limit(100);

      transfers.forEach(transfer => {
        movements.push({
          type: 'transfer',
          id: transfer._id,
          product: transfer.productId,
          quantity: transfer.quantity,
          warehouse: transfer.fromWarehouse,
          user: transfer.transferredBy,
          date: transfer.date,
          details: {
            fromWarehouse: transfer.fromWarehouse,
            toWarehouse: transfer.toWarehouse
          }
        });
      });
    }

    // Get adjustments if operation type is 'adjustment' or 'all'
    if (!operationType || operationType === 'adjustment' || operationType === 'all') {
      const adjustmentFilter = { ...dateFilter };
      if (warehouse) {
        adjustmentFilter.warehouse = warehouse;
      }
      if (productId) {
        adjustmentFilter.productId = productId;
      }

      const adjustments = await Adjustment.find(adjustmentFilter)
        .populate('productId', 'name sku category')
        .populate('adjustedBy', 'name email')
        .sort({ date: -1 })
        .limit(100);

      adjustments.forEach(adjustment => {
        movements.push({
          type: 'adjustment',
          id: adjustment._id,
          product: adjustment.productId,
          quantity: adjustment.newStock - adjustment.oldStock,
          warehouse: adjustment.warehouse,
          user: adjustment.adjustedBy,
          date: adjustment.date,
          details: {
            oldStock: adjustment.oldStock,
            newStock: adjustment.newStock,
            reason: adjustment.adjustmentReason
          }
        });
      });
    }

    // Sort all movements by date (newest first)
    movements.sort((a, b) => new Date(b.date) - new Date(a.date));

    return movements.slice(0, 100); // Limit to 100 most recent
  }
}

module.exports = new DashboardService();

