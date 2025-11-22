/**
 * Receipt Routes
 */

const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');
const { verifyToken, authorizeRoles } = require('../../shared/middlewares/auth');

// All routes are JWT protected
router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'staff'), receiptController.createReceipt.bind(receiptController));
router.get('/', receiptController.getAllReceipts.bind(receiptController));
router.get('/:id', receiptController.getReceiptById.bind(receiptController));
router.put('/:id/status', authorizeRoles('admin', 'staff'), receiptController.updateReceiptStatus.bind(receiptController));

module.exports = router;

