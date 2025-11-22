/**
 * Adjustment Service
 * Handles stock corrections and logging
 */

const mongoose = require('mongoose');
const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');
const logger = require('../../shared/utils/logger');

class AdjustmentService {
  async createAdjustment(adjustmentData) {
    try {
      const { productId, newStock, physicalCount, adjustmentReason, warehouse, location, status = 'draft', adjustedBy, date } = adjustmentData;

      // Verify product exists
      const product = await Product.findOne({
        _id: productId,
        warehouse: warehouse
      });

      if (!product) {
        throw new Error(`Product not found in warehouse: ${warehouse}`);
      }

      const oldStock = product.quantity;
      
      // If physicalCount is provided, use it to calculate newStock
      let calculatedNewStock = newStock;
      if (physicalCount !== undefined && physicalCount !== null) {
        calculatedNewStock = physicalCount;
      }

      // Create adjustment record (draft status - stock not updated yet)
      const adjustment = await Adjustment.create({
        productId,
        oldStock,
        newStock: calculatedNewStock,
        physicalCount: physicalCount !== undefined ? physicalCount : null,
        adjustmentReason,
        warehouse,
        location,
        status,
        adjustedBy,
        date: date || new Date()
      });

      logger.info('Adjustment created', {
        adjustmentId: adjustment._id,
        productId,
        warehouse,
        oldStock,
        newStock: calculatedNewStock,
        status
      });

      return await Adjustment.findById(adjustment._id)
        .populate('productId', 'name sku category quantity')
        .populate('adjustedBy', 'name email')
        .populate('approvedBy', 'name email');
    } catch (error) {
      throw error;
    }
  }

  async updateAdjustmentStatus(adjustmentId, newStatus, approvedBy = null) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const adjustment = await Adjustment.findById(adjustmentId).session(session);
      if (!adjustment) {
        throw new Error('Adjustment not found');
      }

      const oldStatus = adjustment.status;
      const validTransitions = {
        'draft': ['done'],
        'done': []
      };

      if (!validTransitions[oldStatus]?.includes(newStatus)) {
        throw new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`);
      }

      // Update status
      adjustment.status = newStatus;
      if (approvedBy) {
        adjustment.approvedBy = approvedBy;
      }
      await adjustment.save({ session });

      // Only update stock when status changes to 'done'
      if (newStatus === 'done' && oldStatus !== 'done') {
        const product = await Product.findOne({
          _id: adjustment.productId,
          warehouse: adjustment.warehouse
        }).session(session);

        if (!product) {
          throw new Error(`Product not found in warehouse: ${adjustment.warehouse}`);
        }

        const difference = adjustment.newStock - adjustment.oldStock;

        // Update product stock
        product.quantity = adjustment.newStock;
        if (adjustment.location) {
          product.location = adjustment.location;
        }
        product.stockHistory.push({
          warehouse: adjustment.warehouse,
          location: adjustment.location,
          quantity: adjustment.newStock
        });
        await product.save({ session });

        // Log stock ledger
        logger.stockLedger(
          'ADJUSTMENT',
          adjustment.productId.toString(),
          adjustment.warehouse,
          difference,
          adjustment.adjustedBy.toString(),
          {
            oldStock: adjustment.oldStock,
            newStock: adjustment.newStock,
            reason: adjustment.adjustmentReason,
            adjustmentId: adjustment._id.toString(),
            location: adjustment.location
          }
        );

        logger.info('Stock adjustment completed', {
          adjustmentId: adjustment._id,
          productId: adjustment.productId,
          warehouse: adjustment.warehouse,
          oldStock: adjustment.oldStock,
          newStock: adjustment.newStock,
          reason: adjustment.adjustmentReason
        });
      }

      await session.commitTransaction();
      session.endSession();

      return await Adjustment.findById(adjustmentId)
        .populate('productId', 'name sku category quantity')
        .populate('adjustedBy', 'name email')
        .populate('approvedBy', 'name email');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getAllAdjustments(filters = {}) {
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

    const adjustments = await Adjustment.find(query)
      .populate('productId', 'name sku category quantity')
      .populate('adjustedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return adjustments;
  }

  async getAdjustmentById(adjustmentId) {
    const adjustment = await Adjustment.findById(adjustmentId)
      .populate('productId', 'name sku category quantity')
      .populate('adjustedBy', 'name email role');

    if (!adjustment) {
      throw new Error('Adjustment not found');
    }

    return adjustment;
  }
}

module.exports = new AdjustmentService();

