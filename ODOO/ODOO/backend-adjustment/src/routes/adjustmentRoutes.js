/**
 * Adjustment Routes
 */

const express = require('express');
const router = express.Router();
const adjustmentController = require('../controllers/adjustmentController');
const { verifyToken, authorizeRoles } = require('../../shared/middlewares/auth');

// All routes are JWT protected
router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'staff'), adjustmentController.createAdjustment.bind(adjustmentController));
router.get('/', adjustmentController.getAllAdjustments.bind(adjustmentController));
router.get('/:id', adjustmentController.getAdjustmentById.bind(adjustmentController));
router.put('/:id/status', authorizeRoles('admin', 'staff'), adjustmentController.updateAdjustmentStatus.bind(adjustmentController));

module.exports = router;

