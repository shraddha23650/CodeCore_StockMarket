/**
 * Transfer Routes
 */

const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { verifyToken, authorizeRoles } = require('../../shared/middlewares/auth');

// All routes are JWT protected
router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'staff'), transferController.createTransfer.bind(transferController));
router.get('/', transferController.getAllTransfers.bind(transferController));
router.get('/:id', transferController.getTransferById.bind(transferController));
router.put('/:id/status', authorizeRoles('admin', 'staff'), transferController.updateTransferStatus.bind(transferController));

module.exports = router;

