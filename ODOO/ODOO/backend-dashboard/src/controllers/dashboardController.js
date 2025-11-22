/**
 * Dashboard Controller
 */

const dashboardService = require('../services/dashboardService');
const { sendSuccess, sendError } = require('../../shared/utils/response');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const filters = {
        warehouse: req.query.warehouse,
        category: req.query.category,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const summary = await dashboardService.getSummary(filters);
      return sendSuccess(res, 'Dashboard summary retrieved successfully', summary);
    } catch (error) {
      next(error);
    }
  }

  async getMovements(req, res, next) {
    try {
      const filters = {
        warehouse: req.query.warehouse,
        productId: req.query.productId,
        category: req.query.category,
        operationType: req.query.operationType, // receipt, delivery, transfer, adjustment, all
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const movements = await dashboardService.getMovements(filters);
      return sendSuccess(res, 'Stock movements retrieved successfully', movements);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();

