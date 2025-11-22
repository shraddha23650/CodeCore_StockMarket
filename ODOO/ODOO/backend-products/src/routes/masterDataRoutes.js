/**
 * Master Data Routes
 */

const express = require('express');
const router = express.Router();
const masterDataController = require('../controllers/masterDataController');
const { verifyToken, authorizeRoles } = require('../../shared/middlewares/auth');

// Apply authentication to all routes
router.use(verifyToken);

// Warehouse routes
router.post('/warehouses', authorizeRoles('admin', 'staff'), masterDataController.createWarehouse.bind(masterDataController));
router.get('/warehouses', masterDataController.getAllWarehouses.bind(masterDataController));
router.get('/warehouses/:id', masterDataController.getWarehouseById.bind(masterDataController));
router.put('/warehouses/:id', authorizeRoles('admin'), masterDataController.updateWarehouse.bind(masterDataController));
router.delete('/warehouses/:id', authorizeRoles('admin'), masterDataController.deleteWarehouse.bind(masterDataController));

// Category routes
router.post('/categories', authorizeRoles('admin', 'staff'), masterDataController.createCategory.bind(masterDataController));
router.get('/categories', masterDataController.getAllCategories.bind(masterDataController));
router.get('/categories/:id', masterDataController.getCategoryById.bind(masterDataController));
router.put('/categories/:id', authorizeRoles('admin'), masterDataController.updateCategory.bind(masterDataController));
router.delete('/categories/:id', authorizeRoles('admin'), masterDataController.deleteCategory.bind(masterDataController));

// Location routes
router.post('/locations', authorizeRoles('admin', 'staff'), masterDataController.createLocation.bind(masterDataController));
router.get('/locations', masterDataController.getAllLocations.bind(masterDataController));
router.get('/locations/warehouse/:warehouse', masterDataController.getLocationsByWarehouse.bind(masterDataController));
router.get('/locations/:id', masterDataController.getLocationById.bind(masterDataController));
router.put('/locations/:id', authorizeRoles('admin'), masterDataController.updateLocation.bind(masterDataController));
router.delete('/locations/:id', authorizeRoles('admin'), masterDataController.deleteLocation.bind(masterDataController));

module.exports = router;

