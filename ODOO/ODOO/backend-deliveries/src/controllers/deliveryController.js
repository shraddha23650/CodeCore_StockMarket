/**
 * Delivery Controller
 */

const deliveryService = require('../services/deliveryService');
const { sendSuccess, sendError } = require('../../shared/utils/response');

class DeliveryController {
  async createDelivery(req, res, next) {
    try {
      const deliveryData = {
        ...req.body,
        deliveredBy: req.user.userId
      };

      const delivery = await deliveryService.createDelivery(deliveryData);
      return sendSuccess(res, 'Delivery created successfully', delivery, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllDeliveries(req, res, next) {
    try {
      const filters = {
        warehouse: req.query.warehouse,
        productId: req.query.productId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const deliveries = await deliveryService.getAllDeliveries(filters);
      return sendSuccess(res, 'Deliveries retrieved successfully', deliveries);
    } catch (error) {
      next(error);
    }
  }

  async getDeliveryById(req, res, next) {
    try {
      const delivery = await deliveryService.getDeliveryById(req.params.id);
      return sendSuccess(res, 'Delivery retrieved successfully', delivery);
    } catch (error) {
      next(error);
    }
  }

  async updateDeliveryStatus(req, res, next) {
    try {
      const { status } = req.body;
      const delivery = await deliveryService.updateDeliveryStatus(
        req.params.id,
        status,
        req.user.userId
      );
      return sendSuccess(res, 'Delivery status updated successfully', delivery);
    } catch (error) {
      next(error);
    }
  }

  async updatePicking(req, res, next) {
    try {
      const { pickedQuantity, location } = req.body;
      const delivery = await deliveryService.updatePicking(
        req.params.id,
        pickedQuantity,
        location
      );
      return sendSuccess(res, 'Picking updated successfully', delivery);
    } catch (error) {
      next(error);
    }
  }

  async updatePacking(req, res, next) {
    try {
      const { packedQuantity } = req.body;
      const delivery = await deliveryService.updatePacking(
        req.params.id,
        packedQuantity
      );
      return sendSuccess(res, 'Packing updated successfully', delivery);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeliveryController();

