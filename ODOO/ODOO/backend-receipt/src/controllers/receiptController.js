/**
 * Receipt Controller
 */

const receiptService = require('../services/receiptService');
const { sendSuccess, sendError } = require('../../shared/utils/response');

class ReceiptController {
  async createReceipt(req, res, next) {
    try {
      const receiptData = {
        ...req.body,
        receivedBy: req.user.userId
      };

      const receipt = await receiptService.createReceipt(receiptData);
      return sendSuccess(res, 'Receipt created successfully', receipt, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllReceipts(req, res, next) {
    try {
      const filters = {
        warehouse: req.query.warehouse,
        productId: req.query.productId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const receipts = await receiptService.getAllReceipts(filters);
      return sendSuccess(res, 'Receipts retrieved successfully', receipts);
    } catch (error) {
      next(error);
    }
  }

  async getReceiptById(req, res, next) {
    try {
      const receipt = await receiptService.getReceiptById(req.params.id);
      return sendSuccess(res, 'Receipt retrieved successfully', receipt);
    } catch (error) {
      next(error);
    }
  }

  async updateReceiptStatus(req, res, next) {
    try {
      const { status } = req.body;
      const receipt = await receiptService.updateReceiptStatus(
        req.params.id,
        status,
        req.user.userId
      );
      return sendSuccess(res, 'Receipt status updated successfully', receipt);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReceiptController();

