/**
 * Transfer Service
 * Handles internal stock movement between warehouses with atomic transactions
 */

const mongoose = require('mongoose');
const Transfer = require('../models/Transfer');
const Product = require('../models/Product');
const logger = require('../../shared/utils/logger');

class TransferService {
  async createTransfer(transferData) {
    try {
      const { productId, fromWarehouse, toWarehouse, fromLocation, toLocation, quantity, status = 'draft', transferredBy, date } = transferData;

      // Validate warehouses are different
      if (fromWarehouse === toWarehouse) {
        throw new Error('Source and destination warehouses cannot be the same');
      }

      // Find source product
      const sourceProduct = await Product.findOne({
        _id: productId,
        warehouse: fromWarehouse
      });

      if (!sourceProduct) {
        throw new Error(`Product not found in source warehouse: ${fromWarehouse}`);
      }

      // Validate stock availability (only if status is not draft)
      if (status !== 'draft' && sourceProduct.quantity < quantity) {
        throw new Error(`Insufficient stock in source warehouse. Available: ${sourceProduct.quantity}, Required: ${quantity}`);
      }

      // Create transfer record (draft status - stock not updated yet)
      const transfer = await Transfer.create({
        productId: sourceProduct._id,
        fromWarehouse,
        toWarehouse,
        fromLocation,
        toLocation,
        quantity,
        status,
        transferredBy,
        date: date || new Date()
      });

      logger.info('Transfer created', {
        transferId: transfer._id,
        productId: sourceProduct._id,
        sku: sourceProduct.sku,
        fromWarehouse,
        toWarehouse,
        quantity,
        status
      });

      return await Transfer.findById(transfer._id)
        .populate('productId', 'name sku category quantity')
        .populate('transferredBy', 'name email')
        .populate('approvedBy', 'name email');
    } catch (error) {
      throw error;
    }
  }

  async updateTransferStatus(transferId, newStatus, approvedBy = null) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transfer = await Transfer.findById(transferId).session(session);
      if (!transfer) {
        throw new Error('Transfer not found');
      }

      const oldStatus = transfer.status;
      const validTransitions = {
        'draft': ['waiting', 'canceled'],
        'waiting': ['ready', 'canceled'],
        'ready': ['done', 'canceled'],
        'done': [],
        'canceled': [],
        'failed': []
      };

      if (!validTransitions[oldStatus]?.includes(newStatus)) {
        throw new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`);
      }

      // Update status
      transfer.status = newStatus;
      if (approvedBy) {
        transfer.approvedBy = approvedBy;
      }
      await transfer.save({ session });

      // Only update stock when status changes to 'done'
      if (newStatus === 'done' && oldStatus !== 'done') {
        // Find source product
        const sourceProduct = await Product.findOne({
          _id: transfer.productId,
          warehouse: transfer.fromWarehouse
        }).session(session);

        if (!sourceProduct) {
          throw new Error(`Product not found in source warehouse: ${transfer.fromWarehouse}`);
        }

        // Validate stock availability
        if (sourceProduct.quantity < transfer.quantity) {
          throw new Error(`Insufficient stock in source warehouse. Available: ${sourceProduct.quantity}, Required: ${transfer.quantity}`);
        }

        // Find or create destination product by SKU and warehouse
        let destProduct = await Product.findOne({
          sku: sourceProduct.sku,
          warehouse: transfer.toWarehouse
        }).session(session);

        if (!destProduct) {
          // Create product entry in destination warehouse
          destProduct = await Product.create([{
            name: sourceProduct.name,
            sku: sourceProduct.sku,
            category: sourceProduct.category,
            quantity: 0,
            reorderLevel: sourceProduct.reorderLevel,
            unit: sourceProduct.unit,
            warehouse: transfer.toWarehouse,
            location: transfer.toLocation,
            stockHistory: [{
              warehouse: transfer.toWarehouse,
              location: transfer.toLocation,
              quantity: 0
            }]
          }], { session });
          destProduct = destProduct[0];
        }

        // Decrease stock from source
        sourceProduct.quantity -= transfer.quantity;
        if (transfer.fromLocation) {
          sourceProduct.location = transfer.fromLocation;
        }
        sourceProduct.stockHistory.push({
          warehouse: transfer.fromWarehouse,
          location: transfer.fromLocation,
          quantity: sourceProduct.quantity
        });
        await sourceProduct.save({ session });

        // Increase stock in destination
        destProduct.quantity += transfer.quantity;
        if (transfer.toLocation) {
          destProduct.location = transfer.toLocation;
        }
        destProduct.stockHistory.push({
          warehouse: transfer.toWarehouse,
          location: transfer.toLocation,
          quantity: destProduct.quantity
        });
        await destProduct.save({ session });

        // Log stock ledger for source
        logger.stockLedger(
          'TRANSFER_OUT',
          sourceProduct._id.toString(),
          transfer.fromWarehouse,
          -transfer.quantity,
          transfer.transferredBy.toString(),
          {
            toWarehouse: transfer.toWarehouse,
            sku: sourceProduct.sku,
            transferId: transfer._id.toString(),
            fromLocation: transfer.fromLocation,
            toLocation: transfer.toLocation
          }
        );

        // Log stock ledger for destination
        logger.stockLedger(
          'TRANSFER_IN',
          destProduct._id.toString(),
          transfer.toWarehouse,
          transfer.quantity,
          transfer.transferredBy.toString(),
          {
            fromWarehouse: transfer.fromWarehouse,
            sku: destProduct.sku,
            transferId: transfer._id.toString(),
            fromLocation: transfer.fromLocation,
            toLocation: transfer.toLocation
          }
        );

        logger.info('Transfer completed and stock updated', {
          transferId: transfer._id,
          sourceProductId: sourceProduct._id,
          destProductId: destProduct._id,
          sku: sourceProduct.sku,
          fromWarehouse: transfer.fromWarehouse,
          toWarehouse: transfer.toWarehouse,
          quantity: transfer.quantity
        });
      }

      await session.commitTransaction();
      session.endSession();

      return await Transfer.findById(transferId)
        .populate('productId', 'name sku category quantity')
        .populate('transferredBy', 'name email')
        .populate('approvedBy', 'name email');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getAllTransfers(filters = {}) {
    const { warehouse, productId, status, startDate, endDate, fromWarehouse, toWarehouse } = filters;
    const query = {};

    if (warehouse) {
      query.$or = [
        { fromWarehouse: warehouse },
        { toWarehouse: warehouse }
      ];
    }

    if (fromWarehouse) {
      query.fromWarehouse = fromWarehouse;
    }

    if (toWarehouse) {
      query.toWarehouse = toWarehouse;
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

    const transfers = await Transfer.find(query)
      .populate('productId', 'name sku category quantity')
      .populate('transferredBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return transfers;
  }

  async getTransferById(transferId) {
    const transfer = await Transfer.findById(transferId)
      .populate('productId', 'name sku category')
      .populate('transferredBy', 'name email role');

    if (!transfer) {
      throw new Error('Transfer not found');
    }

    return transfer;
  }
}

module.exports = new TransferService();

