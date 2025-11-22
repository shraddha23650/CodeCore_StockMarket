/**
 * Receipt Service
 * Handles incoming stock and automatically increases product stock
 */

const mongoose = require('mongoose');
const Receipt = require('../models/Receipt');
const Product = require('../models/Product');
const logger = require('../../shared/utils/logger');

class ReceiptService {
  async createReceipt(receiptData) {
    try {
      const { productId, quantity, supplier, warehouse, location, status = 'draft', receivedBy, date } = receiptData;

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Verify warehouse matches
      if (product.warehouse !== warehouse) {
        throw new Error('Warehouse mismatch with product');
      }

      // Create receipt (draft status - stock not updated yet)
      const receipt = await Receipt.create({
        productId,
        quantity,
        supplier,
        warehouse,
        location,
        status,
        receivedBy,
        date: date || new Date()
      });

      logger.info('Receipt created', {
        receiptId: receipt._id,
        productId,
        quantity,
        status
      });

      return await Receipt.findById(receipt._id)
        .populate('productId', 'name sku category quantity')
        .populate('receivedBy', 'name email')
        .populate('approvedBy', 'name email');
    } catch (error) {
      throw error;
    }
  }

  async updateReceiptStatus(receiptId, newStatus, approvedBy = null) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const receipt = await Receipt.findById(receiptId).session(session);
      if (!receipt) {
        throw new Error('Receipt not found');
      }

      const oldStatus = receipt.status;
      const validTransitions = {
        'draft': ['waiting', 'canceled'],
        'waiting': ['ready', 'canceled'],
        'ready': ['done', 'canceled'],
        'done': [],
        'canceled': []
      };

      if (!validTransitions[oldStatus]?.includes(newStatus)) {
        throw new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`);
      }

      // Update status
      receipt.status = newStatus;
      if (approvedBy) {
        receipt.approvedBy = approvedBy;
      }
      await receipt.save({ session });

      // Only update stock when status changes to 'done'
      if (newStatus === 'done' && oldStatus !== 'done') {
        const product = await Product.findById(receipt.productId).session(session);
        if (!product) {
          throw new Error('Product not found');
        }

        // Increase product stock
        product.quantity += receipt.quantity;
        if (receipt.location) {
          product.location = receipt.location;
        }
        product.stockHistory.push({
          warehouse: receipt.warehouse,
          location: receipt.location,
          quantity: product.quantity
        });
        await product.save({ session });

        // Log stock ledger
        logger.stockLedger(
          'RECEIPT',
          receipt.productId.toString(),
          receipt.warehouse,
          receipt.quantity,
          receipt.receivedBy.toString(),
          {
            supplier: receipt.supplier,
            receiptId: receipt._id.toString(),
            location: receipt.location
          }
        );

        logger.info('Receipt completed and stock updated', {
          receiptId: receipt._id,
          productId: receipt.productId,
          quantity: receipt.quantity
        });
      }

      await session.commitTransaction();
      session.endSession();

      return await Receipt.findById(receiptId)
        .populate('productId', 'name sku category quantity')
        .populate('receivedBy', 'name email')
        .populate('approvedBy', 'name email');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getAllReceipts(filters = {}) {
    const { warehouse, productId, status, startDate, endDate } = filters;
    const query = {};

    if (warehouse) {
      query.warehouse = warehouse;
    }

    if (productId) {
      query.productId = productId;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const receipts = await Receipt.find(query)
      .populate('productId', 'name sku category quantity')
      .populate('receivedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return receipts;
  }

  async getReceiptById(receiptId) {
    const receipt = await Receipt.findById(receiptId)
      .populate('productId', 'name sku category quantity')
      .populate('receivedBy', 'name email role');

    if (!receipt) {
      throw new Error('Receipt not found');
    }

    return receipt;
  }
}

module.exports = new ReceiptService();

