/**
 * Delivery Service
 * Handles outgoing stock and validates stock availability
 */

const mongoose = require('mongoose');
const Delivery = require('../models/Delivery');
const Product = require('../models/Product');
const logger = require('../../shared/utils/logger');

class DeliveryService {
  async createDelivery(deliveryData) {
    try {
      const { productId, quantity, deliveredTo, warehouse, location, status = 'draft', deliveredBy, date } = deliveryData;

      // Verify product exists
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Verify warehouse matches
      if (product.warehouse !== warehouse) {
        throw new Error('Warehouse mismatch with product');
      }

      // Validate stock availability (only if status is not draft)
      if (status !== 'draft' && product.quantity < quantity) {
        throw new Error(`Insufficient stock. Available: ${product.quantity}, Required: ${quantity}`);
      }

      // Create delivery (draft status - stock not updated yet)
      const delivery = await Delivery.create({
        productId,
        quantity,
        deliveredTo,
        warehouse,
        location,
        status,
        deliveredBy,
        date: date || new Date()
      });

      logger.info('Delivery created', {
        deliveryId: delivery._id,
        productId,
        quantity,
        status
      });

      return await Delivery.findById(delivery._id)
        .populate('productId', 'name sku category quantity')
        .populate('deliveredBy', 'name email')
        .populate('approvedBy', 'name email');
    } catch (error) {
      throw error;
    }
  }

  async updateDeliveryStatus(deliveryId, newStatus, approvedBy = null) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const delivery = await Delivery.findById(deliveryId).session(session);
      if (!delivery) {
        throw new Error('Delivery not found');
      }

      const oldStatus = delivery.status;
      const validTransitions = {
        'draft': ['waiting', 'canceled'],
        'waiting': ['ready', 'canceled'],
        'ready': ['picking', 'canceled'],
        'picking': ['packing', 'canceled'],
        'packing': ['done', 'canceled'],
        'done': [],
        'canceled': []
      };

      if (!validTransitions[oldStatus]?.includes(newStatus)) {
        throw new Error(`Invalid status transition from ${oldStatus} to ${newStatus}`);
      }

      // Update status
      delivery.status = newStatus;
      if (approvedBy) {
        delivery.approvedBy = approvedBy;
      }
      await delivery.save({ session });

      // Only update stock when status changes to 'done'
      if (newStatus === 'done' && oldStatus !== 'done') {
        const product = await Product.findById(delivery.productId).session(session);
        if (!product) {
          throw new Error('Product not found');
        }

        // Validate stock availability
        if (product.quantity < delivery.quantity) {
          throw new Error(`Insufficient stock. Available: ${product.quantity}, Required: ${delivery.quantity}`);
        }

        // Decrease product stock
        product.quantity -= delivery.quantity;
        product.stockHistory.push({
          warehouse: delivery.warehouse,
          location: delivery.location,
          quantity: product.quantity
        });
        await product.save({ session });

        // Log stock ledger
        logger.stockLedger(
          'DELIVERY',
          delivery.productId.toString(),
          delivery.warehouse,
          -delivery.quantity,
          delivery.deliveredBy.toString(),
          {
            deliveredTo: delivery.deliveredTo,
            deliveryId: delivery._id.toString(),
            location: delivery.location
          }
        );

        logger.info('Delivery completed and stock updated', {
          deliveryId: delivery._id,
          productId: delivery.productId,
          quantity: delivery.quantity
        });
      }

      await session.commitTransaction();
      session.endSession();

      return await Delivery.findById(deliveryId)
        .populate('productId', 'name sku category quantity')
        .populate('deliveredBy', 'name email')
        .populate('approvedBy', 'name email');
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async updatePicking(deliveryId, pickedQuantity, location) {
    try {
      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        throw new Error('Delivery not found');
      }

      if (delivery.status !== 'picking') {
        throw new Error('Delivery must be in picking status to update picking');
      }

      if (pickedQuantity > delivery.quantity) {
        throw new Error('Picked quantity cannot exceed requested quantity');
      }

      delivery.pickedQuantity = pickedQuantity;
      if (location) {
        delivery.location = location;
      }
      await delivery.save();

      logger.info('Delivery picking updated', {
        deliveryId: delivery._id,
        pickedQuantity
      });

      return await Delivery.findById(deliveryId)
        .populate('productId', 'name sku category quantity')
        .populate('deliveredBy', 'name email');
    } catch (error) {
      throw error;
    }
  }

  async updatePacking(deliveryId, packedQuantity) {
    try {
      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        throw new Error('Delivery not found');
      }

      if (delivery.status !== 'packing') {
        throw new Error('Delivery must be in packing status to update packing');
      }

      if (packedQuantity > delivery.pickedQuantity) {
        throw new Error('Packed quantity cannot exceed picked quantity');
      }

      delivery.packedQuantity = packedQuantity;
      await delivery.save();

      logger.info('Delivery packing updated', {
        deliveryId: delivery._id,
        packedQuantity
      });

      return await Delivery.findById(deliveryId)
        .populate('productId', 'name sku category quantity')
        .populate('deliveredBy', 'name email');
    } catch (error) {
      throw error;
    }
  }

  async getAllDeliveries(filters = {}) {
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

    const deliveries = await Delivery.find(query)
      .populate('productId', 'name sku category quantity')
      .populate('deliveredBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return deliveries;
  }

  async getDeliveryById(deliveryId) {
    const delivery = await Delivery.findById(deliveryId)
      .populate('productId', 'name sku category quantity')
      .populate('deliveredBy', 'name email role');

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    return delivery;
  }
}

module.exports = new DeliveryService();

