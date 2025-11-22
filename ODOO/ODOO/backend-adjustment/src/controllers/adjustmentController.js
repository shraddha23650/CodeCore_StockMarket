/**
 * Adjustment Controller
 */

const adjustmentService = require('../services/adjustmentService');
const { sendSuccess, sendError } = require('../../shared/utils/response');

class AdjustmentController {
  async createAdjustment(req, res, next) {
    try {
      const adjustmentData = {
        ...req.body,
        adjustedBy: req.user.userId
      };

      const adjustment = await adjustmentService.createAdjustment(adjustmentData);
      return sendSuccess(res, 'Adjustment created successfully', adjustment, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllAdjustments(req, res, next) {
    try {
      const filters = {
        warehouse: req.query.warehouse,
        productId: req.query.productId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const adjustments = await adjustmentService.getAllAdjustments(filters);
      return sendSuccess(res, 'Adjustments retrieved successfully', adjustments);
    } catch (error) {
      next(error);
    }
  }

  async getAdjustmentById(req, res, next) {
    try {
      const adjustment = await adjustmentService.getAdjustmentById(req.params.id);
      return sendSuccess(res, 'Adjustment retrieved successfully', adjustment);
    } catch (error) {
      next(error);
    }
  }

  async updateAdjustmentStatus(req, res, next) {
    try {
      const { status } = req.body;
      const adjustment = await adjustmentService.updateAdjustmentStatus(
        req.params.id,
        status,
        req.user.userId
      );
      return sendSuccess(res, 'Adjustment status updated successfully', adjustment);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdjustmentController();

