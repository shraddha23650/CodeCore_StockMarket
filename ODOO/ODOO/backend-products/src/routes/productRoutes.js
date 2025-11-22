/**
 * Product Routes
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, authorizeRoles } = require('../../shared/middlewares/auth');

// All routes are JWT protected
router.use(verifyToken);

router.post('/', authorizeRoles('admin', 'staff'), productController.createProduct.bind(productController));
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.put('/:id', authorizeRoles('admin', 'staff'), productController.updateProduct.bind(productController));
router.delete('/:id', authorizeRoles('admin'), productController.deleteProduct.bind(productController));

module.exports = router;

