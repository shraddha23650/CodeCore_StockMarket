/**
 * Delivery Routes
 */

const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { verifyToken, authorizeRoles } = require('../../shared/middlewares/auth');

// All routes are JWT protected
router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'staff'), deliveryController.createDelivery.bind(deliveryController));
router.get('/', deliveryController.getAllDeliveries.bind(deliveryController));
router.get('/:id', deliveryController.getDeliveryById.bind(deliveryController));
router.put('/:id/status', authorizeRoles('admin', 'staff'), deliveryController.updateDeliveryStatus.bind(deliveryController));
router.put('/:id/picking', authorizeRoles('admin', 'staff'), deliveryController.updatePicking.bind(deliveryController));
router.put('/:id/packing', authorizeRoles('admin', 'staff'), deliveryController.updatePacking.bind(deliveryController));

module.exports = router;

