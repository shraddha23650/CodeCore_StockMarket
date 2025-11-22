/**
 * Transfer Controller
 */

const transferService = require('../services/transferService');
const { sendSuccess, sendError } = require('../../shared/utils/response');

class TransferController {
  async createTransfer(req, res, next) {
    try {
      const transferData = {
        ...req.body,
        transferredBy: req.user.userId
      };

      const transfer = await transferService.createTransfer(transferData);
      return sendSuccess(res, 'Transfer created successfully', transfer, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllTransfers(req, res, next) {
    try {
      const filters = {
        warehouse: req.query.warehouse,
        productId: req.query.productId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        fromWarehouse: req.query.fromWarehouse,
        toWarehouse: req.query.toWarehouse
      };

      const transfers = await transferService.getAllTransfers(filters);
      return sendSuccess(res, 'Transfers retrieved successfully', transfers);
    } catch (error) {
      next(error);
    }
  }

  async getTransferById(req, res, next) {
    try {
      const transfer = await transferService.getTransferById(req.params.id);
      return sendSuccess(res, 'Transfer retrieved successfully', transfer);
    } catch (error) {
      next(error);
    }
  }

  async updateTransferStatus(req, res, next) {
    try {
      const { status } = req.body;
      const transfer = await transferService.updateTransferStatus(
        req.params.id,
        status,
        req.user.userId
      );
      return sendSuccess(res, 'Transfer status updated successfully', transfer);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransferController();

